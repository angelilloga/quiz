module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz', {
		pregunta: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: {
					msg: "--> Falta pregunta"
				}
			}
		},
		respuesta: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: {
					msg: "--> Falta repuesta"
				}
			}
		},
		tema: {
			type: DataTypes.STRING,
			validate: {
				isIn: {
					args: [['otro', 'humanidades', 'ocio', 'ciencia', 'tecnologia']],
					msg: "--> Falta tema"
				}
			}
		}
	});
}