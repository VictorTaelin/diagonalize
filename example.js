var D = require(".");

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
