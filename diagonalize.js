// Diagonalizes a generator function that:
// - returns when the computation is complete
// - throws to prune a bad branch
// - yields an array of generators to explore infinite branches
function diagonalize(func) {
  var visit = [[null, func(), null]];
  var revis = [];
  var index = 0;
  visits: while (index < visit.length || revis.length > 0) {
    if (revis.length > 0) {
      var [back,func,argm] = visit[revis.pop()];
    } else {
      var [back,func,argm] = visit[index];
    }
    try {
      var next = func.next(argm); 
      if (next.done) {
        if (back === null) {
          return next.value;
        } else {
          visit[back][2] = next.value;
          revis.push(back);
        };
      } else {
        for (var down of next.value) {
          visit.push([index, down, null]);
        };
      }
    } catch (e) {}
    ++index;
  }
  throw "Search failed.";
};

module.exports = diagonalize;
