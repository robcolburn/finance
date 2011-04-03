
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , tablet = require('tablet')
  , Resource = require('express-resource')
  , Database = require('./lib/db')
  , main = require('./controllers/main');

var app = module.exports = express.createServer();

// stylus compiler

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('paths', [tablet.path]);
}

// - parse json dates
// - set lengths

function normalize() {
  var ids = Object.keys(db.items);

  // dates
  ids.forEach(function(id){
    var item = db.items[id];
    item.date = new Date(item.date);
  });

  // length
  Object.defineProperty(db.items, 'length', { get: function(){
    return Object.keys(db.items).length;
  }});
}

// configuration

app.configure(function(){
  app.set('title', 'Financial Management');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.helpers(require('./lib/helpers'));
});

app.configure('development', function(){
  db = new Database('/tmp/finance.db');
  db.load(normalize);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('tj', function(){
  app.set('title', "TJ's Financial Management");
  db = new Database('/Users/tj/dropbox/documents/finances-tj.db');
  db.load(normalize);
  app.use(express.errorHandler({ dumpExceptions: true }));
});

// routing

app.get('/', main.index);
app.resource('item', require('./controllers/item'));

// listen

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);
console.log('  database: %s', db.path);
