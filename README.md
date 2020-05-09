Diagonalize
===========

Allows you to create breadth-first recursive functions to search possibly
infinite branches without getting stuck. For example:

```javascript
// Searches for a 16-bit string following the 0101... pattern
function search(s = "") { 
  if (s.length === 8 && /^(01)*$/.test(s)) {
    return D.done(s);
  } else if (/(11)/.test(s) || /(00)/.test(s)) { // optimizes by pruning
    return D.fail("prune");
  } else {
    return D.wide([[search,[s+"0"]], [search,[s+"1"]]], (a) => D.done(a));
  };
};
console.log("found " + D.exec(() => search("")));
```

The program above searches all binary strings until it finds a 16-bit one with
the `0101...` pattern. It uses `D.wide` to suspend the execution of the function
and recurse on multiple branches, descending diagonally until a value is
returned with `D.done`, and then continuing on the callback. It optimizes the
search by pruning bad branches (strings containing consecutive 1s or 0s) with a
`D.fail`. You can also represent normal recursive calls (depth first) with
`D.deep`, which immediately resumes the recursive branches:

```javascript
// Computes 2^8 recursively
function pow(n = 0) { 
  if (n === 8) {
    return D.done(1);
  } else {
    return (
      D.deep([[pow, [n + 1]]], (a) => 
      D.deep([[pow, [n + 1]]], (b) => 
      D.done(a + b))));
  };
};
console.log("found " + D.exec(() => pow(0)));
```

By combining `deep` and `wide`, we're able to perform searches. For example, the
program below enumerates all λ-terms until it finds `λf. λx. (f (f (f (f x))))`:

```javascript
// Enumerates all lambda terms until it finds `λf. λx. (f (f (f (f x))))`
function show(term) {
  switch (term[0]) {
    case "Lam": return "λ"+show(term[1]);
    case "App": return "("+show(term[1])+" "+show(term[2])+")";
    case "Var": return term[1];
    case "Hol": return "_";
  };
};
function terms(term, depth = 0) {
  switch (term[0]) {
    // If term is a lambda, recurse on body
    case "Lam":
      return (
        D.deep([[terms, [term[1], depth + 1]]], (body) =>
        D.done(["Lam",body])));
    // If term is an application, recurse on func and argm
    case "App":
      return (
        D.deep([[terms, [term[1], depth]]], (func) =>
        D.deep([[terms, [term[2], depth]]], (argm) =>
        D.done(["App",func,argm]))));
    // If term is a variable, return it
    case "Var":
      return D.done(["Var",term[1]]);
    // If term is a hole, diagonalize through possible candidates  
    case "Hol":
      var branches = [];
      branches.push([terms, [["Lam",["Hol"]], depth]]);
      branches.push([terms, [["App",["Hol"],["Hol"]], depth]]);
      for (var i = 0; i < depth; ++i) {
        branches.push([terms, [["Var",i], depth]]);
      };
      return D.wide(branches, (hole) => D.done(hole));
    // The top term is used to receive all results of the search
    case "Top":
      return D.deep([[terms, [term[1], depth]]], (term) => {
        console.log("Generated:", show(term));
        if (show(term) === "λλ(1 (1 (1 (1 0))))") {
          return D.done(term);
        } else {
          return D.fail("Not it."); // continue search forever
        };
      });
  };
};
var done = D.exec(() => terms(["Top", ["Hol"]]));
console.log("Found:", show(done));

```

It works by creating lambda terms with holes, and using `D.wide` to make all
possible instantiations of a hole. For example, the `λf. λx. (f _)` term widens
to `λf. λx. (f f)`, `λf. λx. (f x)`, `λf. λx. (f λz._)`, `λf. λx. (f (_ _))`. It
keeps track of the binder count recursively, so that it only generates well
scoped terms (no unbound variables).


The functions must be constructed in a monadic style. I tried using JavaScript
generators, but ended up having problems since they are mutable, so I couldn't
clone a suspended function state. I later found out a nice library that I could
have used for this purpose, [immutagen](https://github.com/pelotom/immutagen).
