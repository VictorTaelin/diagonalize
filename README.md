Diagonalize
===========

Allows you to create breadth-first recursive functions to search possibly
infinite branches without getting stuck. For example:

```javascript
var D = require(".");

// Searches for a 16-bit string following the 0101... pattern
function search(s = "") { 
  if (s.length === 16 && /^(01)*$/.test(s)) {
    return D.done(s);
  } else if (/(11)/.test(s) || /(00)/.test(s)) { // optimizes by pruning
    throw "prune";
  } else {
    return D.call([[search,[s+"0"]], [search,[s+"1"]]], (a) => D.done(a));
  };
};

console.log("found " + D.diagonalize(() => search("")));
```

The program above searches all binary strings until it finds a 16-bit one with
the `0101...` pattern. It optimizes the search by pruning bad branches (strings
containing consecutive 1s or 0s).

The function must be constructed in a monadic style. I tried using JS
generators, but ended up having problems since they are mutable, so I couldn't
clone a suspended function state. I later found out a nice library that I could
have used for this purpose, [immutagen](https://github.com/pelotom/immutagen).
