//	GET /login -- Formulario de login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {
		errors: errors
	});
};

//	POST /login  -- Crear la sesion
exports.create = function(req, res) {

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {

		if (error) { // Si hay error retornamos mensaje de error de sesion
			req.session.errors = [{
				"message": 'Se ha producido un error: ' + error
			}];
			res.redirect("/login");
			return
		}

		req.session.user = {
			id: user.id,
			username: user.username
		};

		//	Añadimos la hora de conexión a la sessión
		req.session.sessionDate = new Date().getTime();

		res.redirect(req.session.redir.toString());
	});
};

//	DELETE /logout  -- Destruir la sesion
exports.destroy = function(req, res) {
	delete req.session.user;
	delete req.session.sessionDate;
	res.redirect(req.session.redir.toString());

};

//	MW de autorizacion de accesos HTTP restringuidos
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};