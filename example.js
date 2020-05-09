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
