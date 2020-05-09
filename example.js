var diagonalize = require(".");

// Searches for a 12-bit string following the 0101... pattern
function* search(s = "") { 
  if (s.length === 20 && /^(01)*$/.test(s)) {
    return s;
  } else if (/(11)/.test(s)) {
    throw "pruned";
  } else {
    var a = yield [
      search("0" + s),
      search("1" + s),
    ];
    return a;
  };
};

console.log(diagonalize(search));
