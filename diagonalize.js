// Diagonalizes a function
function diagonalize(fn) {
  var nodes = [[fn(), {ctor:"Nil"}]];
  var visit = [];
  var index = 0;
  while (index < nodes.length || visit.length > 0) {
    var [func, cont] = nodes[visit.length ? visit.pop() : index++];
    switch (func.ctor) {
      case "done":
        switch (cont.ctor) {
          case "Nil":
            return func.retr;
          case "Ext":
            try {
              var next = cont.head(func.retr);
              visit.push(nodes.length);
              nodes.push([next, cont.tail]);
            } catch (e) {
              null; // pruned
            }
            break;
        }
        break;
      case "call":
        for (var [fn,xs] of func.next) {
          try {
            var next = fn(...xs);
            nodes.push([next, {ctor:"Ext",head:func.then,tail:cont}]);
          } catch (e) {
            null; // pruned
          };
        };
        break;
    };
  };
  throw "Search failed.";
};

function call(next, then) {
  return {ctor: "call", next, then};
};

function done(retr) {
  return {ctor: "done", retr};
};

module.exports = {diagonalize, call, done};
