
exports.host = 'localhost';
exports.port = process.env.PORT || 9000;

exports.static_path = __dirname + '/../public'; //path for static
exports.view_path = __dirname +'/../views'; //path for view
exports.view_engine = 'pug'; //view engine (can use jade or pug)
exports.view_options = { // view options
	layout: false
};
exports.view_cache = false;
