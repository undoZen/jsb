var api = require('../lib');
var _ = require('underscore');

app.put(/\/.*/, function (req, res, next) {
  var slug = req._parsedUrl.pathname;
  var obj = _.extend({}, req.body, {slug: slug});
  api.doc.put(obj, function (err, doc) {
    if (err) {
      next(err);
    } else if (req.accepts('json') || req.xhr) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({success: true, html: doc.html}))
    } else {
      res.redirect(slug)
    }
  });
});