var _ = require('underscore');
var api = require('../lib');

app.get(/\/.*/, function (req, res, next) {
  var slug = req._parsedUrl.pathname;
  var queryObj = {slug: slug};
  api.doc.get(queryObj, gotDoc);
  function gotDoc(err, doc) {
    var docNotFound = {
      html: 'not found',
      title: 'not found'
    };
    doc = _.extend(
      {},
      doc || {},
      doc && doc.published ? {} : docNotFound
    );
    res.render('index', doc);
  }
});
