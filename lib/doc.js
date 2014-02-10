var marked = require('marked');
var _ = require('underscore');

var reflink = config.reflink;
var models = require('../models');

marked.setOptions({
  gfm: true,
  breaks: true
});

var Doc = models.Doc;

function addDocProp(obj) {
  var o = {};
  o.html = marked(obj.content);
  o.links_to = [];
  o.html.replace(reflink, function (all, title, slug) {
    if ('/' != slug[0]) slug = '/' + slug;
    o.links_to.push(slug);
  });
  o.html.replace(/<h1>([^\n]+)<\/h1>/i, function (all, title) {
    o.title = title;
  });
  if (!o.title) o.title = obj.slug;
  return o;
}

exports.put = function (obj, cb) {
  Doc.findOne({slug: obj.slug}, foundDoc);
  function foundDoc(err, oldDoc) {
    if (err) {
      cb(err);
    } else if (oldDoc) {
      Doc.update(
        {slug: obj.slug},
        {$set: {history: true}},
        {multi: true},
        insertDoc.bind(this, oldDoc.created_at)
      );
    } else {
      insertDoc(Date.now());
    }
  }
  function insertDoc(created_at) {
    obj = _.extend(
      {created_at: created_at, modified_at: Date.now(), history: false},
      obj,
      addDocProp(obj)
    );
    Doc.insert(obj, cb);
  }
};

exports.getTitles = getTitles;
function getTitles (slugs, cb) {
  var queryObj = {slug: {$in: slugs}, history: false};
  Doc.find(queryObj, function (err, docs) {
    var result = {};
    if (err) {
      cb(err);
    } else {
      _.each(docs, function (doc) {
        result[doc.slug] = doc.title;
      });
      cb(null, result);
    }
  });
}

exports.addInnerLinks = addInnerLinks;
function addInnerLinks (html, titles) {
  return html.replace(reflink, function (all, title, slug) {
    if ('/' != slug[0]) {
      slug = '/' + slug;
    }
    if (!title && !slug) return '';
    else if (!slug) return title;
    title = title || titles[slug] || slug.replace(/^\//,'');
    return '<a href="' + slug + '">' + title + '</a>'
  });
}

exports.get = function (queryObj, cb) {
  if ('string' == typeof queryObj) {
    queryObj = {slug: queryObj};
  }
  queryObj = _.pick(queryObj, 'slug', 'published');
  queryObj.history = false;
  Doc.findOne(queryObj, foundOne);
  function foundOne(err, doc) {
    if (err) cb(err);
    else if (!doc) cb(null, null);
    else getTitles(doc.links_to, gotTitles(doc));
  }
  function gotTitles(doc) {
    return function (err, titles) {
      doc.html = addInnerLinks(doc.html, titles);
      cb(null, doc);
    }
  }
}
