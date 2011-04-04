
var j = $;

j(function(){
  var addItem = j('.edit-item').get(0).outerHTML;

  // add item
  j('#items-form').submit(function(){
    var data = j(this).serialize();
    j.post('/items', data, function(res){
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

  // graph
  chart();
});

function notify(type, msg, duration) {
  if (!msg) msg = type, type = 'info';
  duration = duration || 2000;
  var el = j('<li class="' + type + '">' + msg + '</li>');
  j('#notifications').append(el);
  setTimeout(function(){ remove(el); }, duration);
}

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

  overlay.removeClass('hide');
}

function remove(el) {
  j(el).fadeOut(function(){
    j(el).remove();
  });
}

function response(res) {
  if (res.error) {
    notify('error', res.error);
  } else {
    if (res.message) notify(res.message);
    if (res.prepend) j(res.to).prepend(res.prepend);
    if (res.append) j(res.to).append(res.append);
  }
}

function chart() {
  $.get('/items', function(items){
    var size = 100;
    categoryChart(items, size);
    entityChart(items, size);
  });
}

function categoryChart(items, size) {
  var r = Raphael('category-chart')
    , category = data(items, 'category');
  r.g.piechart(size, size, size, category.data, { legend: category.names });
}

function entityChart(items, size) {
  var r = Raphael('entity-chart')
    , tag = data(items, 'entity');
  r.g.piechart(size, size, size, tag.data, { legend: tag.names });
}

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