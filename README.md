Diagonalize
===========

Allows you to create breadth-first recursive functions to search possibly
infinite branches without getting stuck. For example:

```
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

```
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

The function must be constructed in a monadic style. I tried using JavaScript
generators, but ended up having problems since they are mutable, so I couldn't
clone a suspended function state. I later found out a nice library that I could
have used for this purpose, [immutagen](https://github.com/pelotom/immutagen).
