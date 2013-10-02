var express = require('express');
var http = require('http');
var path = require('path');

var app = global.app = module.exports = exports = express();

// all environments
app.set('port', process.env.PORT || 1984);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

'get put'.split(' ').forEach(function (route) {
  require('./routes/' + route);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
