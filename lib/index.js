'doc'.split(' ').forEach(function (route) {
  exports[route] = require('./' + route);
});
