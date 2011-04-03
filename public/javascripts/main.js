
var j = $;

j(document).keypress(function(event){
  // a
  if (97 == event.keyCode) showAddItemForm();
});

j(function(){
  // add item
  j('#add-item-form')
    .find('p:not(.actions)')
    .hide()
    .end()
    .find('#add-item')
    .click(function(){
      var inputs = j('#add-item-form p:not(.actions)')
        , data;
      if (inputs.is(':visible')) {
        data = j('#add-item-form').serialize();
        j.post('/item', data, function(res){
          response(res);
          if (!res.error) {
            hideAddItemForm();
            j('#items').removeClass('hide');
          }
        });
      } else {
        showAddItemForm();
      }
      return false;
    });

  // remove item
  j('#items .delete a').live('click', function(){
    confirm('Delete this item?', function(ok){
      if (ok) {
        var url = j(this).attr('href');
        remove(j(this).parents('tr'));
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
  var dialog = j(j('#confirm').html());
  dialog.find('.message').text(msg);
  dialog.find('.ok').click(function(){ fn(true); });
  dialog.find('.cancel').click(function(){ fn(false); });
  j(document).append(dialog);
  j('#overlay').removeClass('hide');
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
  }
}

function showAddItemForm() {
  j('#add-item-form p:not(.actions)').show();
}

function hideAddItemForm() {
  j('#add-item-form p:not(.actions)').hide();
}