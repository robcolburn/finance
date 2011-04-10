
exports.index = function(req, res){
  res.redirect('/month/0');
};

exports.month = function(req, res){
  var month = req.params.month
    , items = db.months[month].items;
  res.render('month', { items: items });
};