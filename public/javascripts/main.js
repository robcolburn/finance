
// don't copy me :) this is sloppy js

var j = $;

j(function(){
  var addItem = j('.edit-item').get(0).outerHTML;

  // add item
  j('#items-form').submit(function(){
    var data = j(this).serialize();
    j.post('/month/' + express.month + '/items', data, function(res){
      response(res);
      if (!res.error) {
        j('.edit-item').remove();
        j('#items-form tbody').append(addItem);
        chart();
      }
    });
    return false;
  });

  // remove item
  j('#items .delete a').live('click', function(){
    var self = j(this);
    confirm('Delete this item?', function(ok){
      if (ok) {
        var url = self.attr('href');
        remove(self.parents('tr'));
        j.post(url, { _method: 'DELETE' }, function(res){
          response(res);
          chart();
        });
      }
    });
    return false;
  });

  // display charts
  j('#menu .charts a').click(function(){
    $.get('/month/' + express.month + '/items', function(items){
      var dialog = displayChart();
      categoryChart(items, dialog.find('#category-chart').get(0), 550, 200);
      entityChart(items, dialog.find('#entity-chart').get(0), 550, 200);
    });
    return false;
  });

  // sort columns
  j('table thead th').click(function(){
    var i = this.cellIndex
      , self = j(this)
      , table = self.parents('table')
      , tbody = table.find('tbody')
      , rows = table.find('tbody tr').slice(0, -1)
      , add = table.find('tbody tr:last')
      , direction = self.hasClass('asc')
        ? 'desc'
        : 'asc';

    table
      .find('th')
      .removeClass('asc')
      .removeClass('desc');

    self
      .removeClass('asc')
      .removeClass('desc')
      .addClass(direction);

    rows = rows.sort(function(a, b){
      var a = parseInt(j(a.cells[i]).text(), 10)
        , b = parseInt(j(b.cells[i]).text(), 10);
      return 'asc' == direction
        ? a - b
        : b - a;
    });

    rows.each(function(i, row){
      tbody.append(row);
    });

    tbody.append(add);
  });
});

/**
 * Notify `msg` for the given `duration` defaulting to 2 seconds.
 *
 * @param {String} type
 * @param {String} msg
 * @param {Number} duration
 */

function notify(type, msg, duration) {
  if (!msg) msg = type, type = 'info';
  duration = duration || 2000;
  var el = j('<li class="' + type + '">' + msg + '</li>');
  j('#notifications').append(el);
  setTimeout(function(){ remove(el); }, duration);
}

/**
 * Display confirmation `msg`.
 *
 * @param {String} msg
 * @param {Function} fn
 */

function confirm(msg, fn) {
  var dialog = j(j('#confirm').html())
    , overlay = j('#overlay');

  function reply(val) {
    return function(){
      overlay.addClass('hide');
      dialog.remove();
      fn(val);
    }
  }

  dialog
    .appendTo('body')
    .find('.message').text(msg).end()
    .find('.ok').click(reply(true)).focus().end()
    .find('.cancel').click(reply(false));

  dialog.css({
      top: (window.innerHeight / 2) - dialog.height() / 2
    , left: (window.innerWidth / 2) - dialog.width() / 2
  });
  
  j(window).resize(function(){
    dialog.css({
        top: (window.innerHeight / 2) - dialog.height() / 2
      , left: (window.innerWidth / 2) - dialog.width() / 2
    });
  });

  overlay.removeClass('hide');
}

/**
 * Display `chart`.
 *
 * @param {jQuery} chart
 */

function displayChart(chart){
  var dialog = j(j('#chart').html())
    , overlay = j('#overlay');

  dialog
    .appendTo('body')
    .find('.contents').append(chart);

  overlay
    .removeClass('hide')
    .click(function(){
      overlay.addClass('hide');
      dialog.remove();
    });

  setTimeout(function(){
    dialog.css({
        top: (window.innerHeight / 2) - dialog.height() / 2
      , left: (window.innerWidth / 2) - dialog.width() / 2
    });

    j(window).resize(function(){
      dialog.css({
          top: (window.innerHeight / 2) - dialog.height() / 2
        , left: (window.innerWidth / 2) - dialog.width() / 2
      });
    });
  }, 0);

  return dialog;
}

/**
 * Fade out then remove `el`.
 *
 * @param {jQuery} el
 */

function remove(el) {
  j(el).fadeOut(function(){
    j(el).remove();
  });
}

/**
 * Handle `res`.
 *
 * @param {Object} res
 */

function response(res) {
  if (res.error) {
    notify('error', res.error);
  } else {
    if (res.message) notify(res.message);
    if (res.prepend) j(res.to).prepend(res.prepend);
    if (res.append) j(res.to).append(res.append);
  }
}

/**
 * Display charts.
 */

function chart() {
  $.get('/month/' + express.month + '/items', function(items){
    var size = 150;
    categoryChart(items, size);
    entityChart(items, size);
  });
}

/**
 * Generate category chart.
 */

function categoryChart(items, container, width, height) {
  var radius = height * 0.50
    , r = Raphael(container, width, height)
    , category = data(items, 'category');

  var pie = r.g.piechart(
      width / 2
    , height / 2
    , radius
    , category.data, { legend: category.names });

  hover(pie);
}

/**
 * Generate entity chart.
 */

function entityChart(items, container, width, height) {
  var radius = height * 0.50
    , r = Raphael(container, width, height)
    , entity = data(items, 'entity');

  var pie = r.g.piechart(
      width / 2
    , height / 2
    , radius
    , entity.data, { legend: entity.names });

  hover(pie);
}

/**
 * Handle pie segment hover.
 */

function hover(pie) {
  pie.hover(function(){
    this.sector.stop();
    this.sector.scale(1.1, 1.1, this.cx, this.cy);
    if (this.label) {
      this.label[0].stop();
      this.label[0].scale(1.5);
      this.label[1].attr({ 'font-weight': 800 });
    }
  }, function(){
    this.sector.animate({ scale: [1, 1, this.cx, this.cy] }, 500, 'bounce');
    if (this.label) {
      this.label[0].animate({ scale: 1 });
      this.label[1].attr({ 'font-weight': 400 });
    }
  });
}

/**
 * Data mapper.
 */

function data(items, prop) {
  var obj = { names: [], data: [] }
    , sums = {};

  Object.keys(items).forEach(function(id){
    var item = items[id];
    sums[item[prop]] = sums[item[prop]] || { count: 0, amount: 0 };
    sums[item[prop]].count++;
    sums[item[prop]].amount += item.amount;
  });

  Object.keys(sums).forEach(function(name){
    var count = sums[name].count
      , amount = sums[name].amount;

    obj.names.push('$' + amount + ' - ' + name + ' (' + count + ')');
    obj.data.push(amount);
  });

  return obj;
}