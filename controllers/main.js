
exports.index = function(req, res){
  res.render('index', { items: db.items });
};