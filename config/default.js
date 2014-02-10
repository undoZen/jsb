var env = process.env.NODE_ENV || 'development';

var exports = module.exports = {
  dbPath: process.env.DB_PATH || '/tmp/database-' + env,
  reflink: /\[((?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*)\]\[([^\]]+)\]/g
};
console.log(exports.dbPath);
