function wide(next, then) {
  return {ctor: "call", deep: false, next, then};
};

function deep(next, then) {
  return {ctor: "call", deep: true, next, then};
};

function fail(msge) {
  return {ctor: "fail", msge};
};

function done(retr) {
  return {ctor: "done", retr};
};

function exec(fn) {
  var wides = [[fn(), {ctor:"Nil"}]];
  var deeps = [];
  var index = 0;
  var error = null;
  while (index < wides.length || deeps.length > 0) {
    var got = wides[deeps.length ? deeps.pop() : index];
    if (got) {
      var [func, cont] = got;
      wides[index] = null;
      switch (func.ctor) {
        case "done":
          switch (cont.ctor) {
            case "Nil":
              return func.retr;
            case "Ext":
              var next = cont.head(func.retr);
              deeps.push(wides.length);
              wides.push([next, cont.tail]);
              break;
          }
          break;
        case "fail":
          error = func.msge;
          break;
        case "call":
          for (var [fn,xs] of func.next) {
            var next = fn(...xs);
            if (func.deep) {
              deeps.push(wides.length);
            }
            wides.push([next, {ctor:"Ext",head:func.then,tail:cont}]);
          };
      };
    };
    ++index;
  };
  throw error || "Search failed.";
};

module.exports = {wide, deep, done, fail, exec};
