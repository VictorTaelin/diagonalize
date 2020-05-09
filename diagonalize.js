function wide(next, then) {
  return {ctor: "call", deep: false, next, then};
};

function deep(next, then) {
  return {ctor: "call", deep: true, next, then};
};

function done(retr) {
  return {ctor: "done", retr};
};

function exec(fn) {
  var wides = [[fn(), {ctor:"Nil"}]];
  var deeps = [];
  var index = 0;
  while (index < wides.length || deeps.length > 0) {
    var [func, cont] = wides[deeps.length ? deeps.pop() : index++];
    switch (func.ctor) {
      case "done":
        switch (cont.ctor) {
          case "Nil":
            return func.retr;
          case "Ext":
            try {
              var next = cont.head(func.retr);
              deeps.push(wides.length);
              wides.push([next, cont.tail]);
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
            if (func.deep) {
              deeps.push(wides.length);
            }
            wides.push([next, {ctor:"Ext",head:func.then,tail:cont}]);
          } catch (e) {
            null; // pruned
          };
        };
    };
  };
  throw "Search failed.";
};

module.exports = {wide, deep, done, exec};
