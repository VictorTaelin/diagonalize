var diagonalize = require(".");

// Performs a search on binary strings
function* search(cond, str = "") {
  yield search(cond, "0" + str);
  yield search(cond, "1" + str);
  if (cond(str)) {
    return str;
  } else {
    throw null;
  }
};

// Searches for a 12-bit string that matches /^(011)*$/
console.log(diagonalize(search, [str => {
  return str.length === 12 && /^(011)*$/.test(str);
}, ""]));
