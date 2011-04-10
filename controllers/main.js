
exports.index = function(req, res){
  res.redirect('/month/0');
};

exports.month = function(req, res){
  var month = parseInt(req.params.month, 10)
    , items = db.months[month].items;
  res.expose({ month: month });
  res.render('month', { items: items });
};