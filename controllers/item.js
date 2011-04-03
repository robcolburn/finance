
/**
 * Module dependencies.
 */

var utils = require('../lib/helpers');

/**
 * Validate `obj`'s `prop`, with the given validation `type`.
 *
 * @param {Object} obj
 * @param {String} prop
 * @param {String} type
 */

function validate(obj, prop, type) {
  var val = obj[prop];
  switch (type || 'present') {
    case 'number':
      val = parseFloat(val);
      if (isNaN(val)) throw new Error(prop + ' must be a number');
      break;
    case 'present':
      if (!val) throw new Error(prop + ' required');
      break;
    case 'date':
      if (!(val instanceof Date)) throw new Error(prop + ' must be a date');
      if (isNaN(val.getTime())) throw new Error(prop + ' is an invalid date');
      break;
  }
}

/**
 * Create an item.
 */

exports.create = function(req, res, next){
  var item = req.body.item;
  item.date = utils.parseDate(item.date);
  item.tags = item.tags.split(/ *, */);
  try {
    validate(item, 'entity');
    validate(item, 'date', 'date');
    validate(item, 'category');
    validate(item, 'amount', 'number');
    var len = (db.items = db.items || []).push(item);
    item.id = len - 1;
    db.save();
    res.partial('item', { object: item }, function(err, html){
      if (err) return next(err);
      res.send({
          message: 'Added item'
        , prepend: html
        , to: '#items'
      });
    });
  } catch (err) {
    res.send({ error: err.message });
  }
};

/**
 * Destroy an item.
 */

exports.destroy = function(req, res, next){
  var id = req.params.id;
  db.items.splice(id, 1);
  db.save();
  res.send({ message: 'Removed item' });
};