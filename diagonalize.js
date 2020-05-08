// Diagonalizes a generator function that:
// - returns when the computation is complete
// - throws to prune a bad branch
// - yields a recursive call to explore a candidate branch
function diagonalize(fn, args = []) {
  var rec = [fn(...args)];
  for (var i = 0; i < Infinity; ++i) {
    var neo = [];
    for (var fun of rec) {
      while (true) {
        try {
          var got = fun.next();
          if (got.done) {
            return got.value;
          } else {
            neo.push(got.value);
          }
        } catch (e) {
          break;
        }
      }
    }
    if (neo.length === 0) {
      throw "Search failed.";
    } else {
      rec = neo;
    };
  };
};

module.exports = diagonalize;
