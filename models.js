/*
目前的文档结构，现在用 nedb 了，这是之前 mongoose 声明的结构
  slug: String
  title: String 自动根据文档 <h1> 生成
  auto_saved: { type: Boolean, default: false }
  published: { type: Boolean, default: false }
  history: { type: Boolean, default: false }
  content: String
  html: String
  created_at: Date
  modified_at: { type: Date, default: Date.now }
  links_to: [String]
*/

var Datastore = require('nedb');

var db = new Datastore({ filename: config.dbPath, autoload: true });

var Doc = exports.Doc = {};
'find findOne insert update'.split(' ').forEach(function (method) {
  Doc[method] = db[method].bind(db);
});
