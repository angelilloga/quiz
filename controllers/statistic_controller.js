var models = require('../models/models.js');

//	GET /statistic
exports.index = function(req, res) {
	//	Hacemos las consultas
	var result = {};

	//	Consulta de numero total de preguntas
	models.Quiz.count().then(function(totalQuizes) {
			result['Número total de preguntas: '] = totalQuizes;

			//	Consulta de numero total de comentarios
			return models.Comment.count();
		}).then(function(totalComments) {
			result['Número total de comentarios: '] = totalComments;
			result['Número medio de comentarios por pregunta: '] =
				totalComments / result['Número total de preguntas: '];

			return models.Comment.countUnpublished();
		}).then(function(countUnpublished) {
			result['Número de preguntas sin comentarios: '] = countUnpublished;

			return models.Comment.countCommentedQuizes();
		}).then(function(countCommentedQuizes) {
			result['Número de preguntas con comentarios: '] = countCommentedQuizes;

		}).catch(function(err) {
			errors.push(err);
		}) // Errores
		.finally(function() {
			res.render('statistics/index', {
				result: result,
				errors: []
			});
		});
};