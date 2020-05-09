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
    if (deeps.length > 0) {
      var got = deeps.pop();
    } else {
      var got = wides[index];
      wides[index++] = null;
    };
    if (got) {
      var [func, cont] = got;
      switch (func.ctor) {
        case "done":
          switch (cont.ctor) {
            case "Nil":
              return func.retr;
            case "Ext":
              deeps.push([cont.head(func.retr), cont.tail]);
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
              deeps.push([next, {ctor:"Ext",head:func.then,tail:cont}]);
            } else {
              wides.push([next, {ctor:"Ext",head:func.then,tail:cont}]);
            }
          };
      };
    };
  };
  throw error || "Search failed.";
};

module.exports = {wide, deep, done, fail, exec};
