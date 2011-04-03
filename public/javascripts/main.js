
var j = $;

j(document).keypress(function(event){
  // a
  if (97 == event.keyCode) showAddItemForm();
});

j(function(){
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
          if (!res.error) hideAddItemForm();
        });
      } else {
        showAddItemForm();
      }
      return false;
    });
});

function notify(type, msg, duration) {
  if (!msg) msg = type, type = 'info';
  duration = duration || 3000;
  var el = j('<li class="' + type + '">' + msg + '</li>');
  j('#notifications').append(el);
  setTimeout(function(){
    el.fadeOut(function(){
      el.remove();
    });
  }, duration);
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