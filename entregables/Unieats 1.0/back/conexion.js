let mysql = require("mysql");

let conexionDB = mysql.createConnection({
	host: "localhost",
    port: 3307,
	database: "prueba",
	user: "root",
	password: ""
})

conexionDB.connect(function(err){
	if(err){
		throw err;
	}else{
		console.log("Conexión establecida exitosamente.");
	}
});
