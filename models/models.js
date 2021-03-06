var path = require('path');

//	DATABASE_URL = protocol://username:password@host:port/database_name
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/); 
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);

//	Cargar Modelo ORM
var Sequelize = require('sequelize');

//	Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name, user, pwd, 
	{
		dialect : protocol,
		protocol: protocol,
		port: port,
		host: host,
		omitNull: true
	}
);

//	Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//	Importar la definición de la tabla Comment
var Comment = sequelize.import(path.join(__dirname, 'comment'));

//	Relaciones del modelo
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // Exportar definicion de tabla Quiz
exports.Comment = Comment;

//	sequelize.sync() crea e inicializa tabla de preguntas en BBDD
sequelize.sync().then(function() {
	//	success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count) {
		if (count === 0) { // la tabla se inicializa solo si esta vacia 
			Quiz.create({
					pregunta: 'Capital de Italia',
					respuesta: 'Roma',
					tema: 'otro'
				});
			Quiz.create({
					pregunta: 'Capital de Portugal',
					respuesta: 'Lisboa',
					tema: 'otro'
				})
				.then(function() {
					console.log('Base de datos inicializada');
				})
		}
	})
})