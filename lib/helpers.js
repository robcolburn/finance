
/**
 * Months.
 */

var months = [
    'January'
  , 'February'
  , 'March'
  , 'April'
  , 'May'
  , 'June'
  , 'July'
  , 'August'
  , 'September'
  , 'October'
  , 'November'
  , 'December'
];

/**
 * Pad `n` with leading zero.
 */

function pad(n) {
  return n < 10 ? '0' + n : n;
}

/**
 * Format date.
 *
 * @param {String} fmt
 * @param {Date} optional date
 * @return {String}
 */

exports.date = function(fmt, date){
  date = date || new Date;
  return fmt
    .replace(/mm/g, function(){
      return pad(date.getMonth());
    })
    .replace(/dd/g, function(){
      return pad(date.getDate());
    })
    .replace(/yy/g, function(){
      return pad(date.getFullYear().toString().substr(2));
    });
};

/**
 * Parse date in the format of `"mm/dd/yy".
 *
 * @param {String} str
 * @return {Date}
 */

exports.parseDate = function(str){
  var date = new Date
    , parts = str.split('/')
    , month = parseInt(parts.shift(), 10)
    , day = parseInt(parts.shift(), 10)
    , year = parseInt(parts.shift(), 10) + 2000;

  date.setMonth(month);
  date.setDate(day);
  date.setYear(year);

  return date;
};

/**
 * Return the month name for `n`.
 *
 * @param {Number} n
 * @return {String}
 */

exports.monthName = function(n){
  return months[n];
};