var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incuye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error) {
		next(error);
	});
}

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {
		quiz: req.quiz,
		errors: []
	});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';

	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {
		quiz: req.quiz,
		respuesta: resultado,
		errors: []
	});
};

// GET /quizes
exports.index = function(req, res) {

	//	Hacemos la consulta de preguntas si vienen datos
	var search = req.query.search;
	console.log(search);
	if (!search) {
		search = '';
	}

	models.Quiz.findAll({
		where: ["pregunta like ?", '%' + search.replace(/\s+/g, '%') + '%'],
		order: "pregunta asc"
	}).then(function(quizes) {
		res.render('quizes/index', {
			quizes: quizes,
			search: search,
			errors: []
		});
	})
};

//	GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build({
		pregunta: "pregunta",
		respuesta: "Respuesta"
	});
	res.render('quizes/new', {
		quiz: quiz,
		errors: []
	});
};

//	POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(
		function(err) {
			// console.log("AAAAA: "+err.errors[0].message);
			if (err) {
				res.render('quizes/new', {
					quiz: quiz,
					errors: err.errors
				});
			} else {
				//	Guardar en base de datos los campos preguntas y respuestas	
				quiz
					.save({
						fields: ["pregunta", "respuesta"]
					})
					.then(function() {
						res.redirect('/quizes')
					}) //	Redirect HTTP (URL relativo) lista de preguntas
			}
		});
};