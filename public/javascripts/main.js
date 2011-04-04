
var j = $;

j(function(){
  var addItem = j('.edit-item').get(0).outerHTML;

  // add item
  j('#items-form').submit(function(){
    var data = j(this).serialize();
    j.post('/item', data, function(ok){
      j('.edit-item').remove();
      response(ok);
      j('#items-form tbody').append(addItem);
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
        j.post(url, { _method: 'DELETE' }, response);
      }
    });
    return false;
  });
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
