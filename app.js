
/**
 * Module dependencies.
 */

var express = require('express')
  , Resource = require('express-resource')
  , expose = require('express-expose')
  , Database = require('./lib/db')
  , main = require('./controllers/main')
  , stylus = require('stylus')
  , nib = require('nib');

var app = module.exports = express.createServer();

// stylus compiler

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .include(nib.path);
}

// normalize database on boot

function normalize() {
  var month
    , ids;

  // months
  for (var i = 0; i < 12; ++i) {
    month = db.months[i] = db.months[i] || { items: {} };
    ids = Object.keys(month.items);
    // dates
    ids.forEach(function(id){
      var item = month.items[id];
      item.date = new Date(item.date);
    });
  }
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
var month = app.resource('month', require('./controllers/month'));
var items = app.resource('items', require('./controllers/item'));
month.add(items);

// listen

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);
console.log('  database: %s', db.path);
