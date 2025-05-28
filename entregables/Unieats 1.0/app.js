// Objetos con los que se importan a las librerías:
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

// Con estas líneas de código se monta la aplicación para que el servidor reciba peticiones HTTP de las api
app.use(cors());
app.use(express.json());

// Se crea la conexión a MySQL, próximamente optimizado con dotenv
const base_datos = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'prueba',
  port: 3307
});

// Conexión directa a la base de datos
base_datos.connect((err) => {
  if (err) {
    console.error('Error al conectar con la BD:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// API para introducir información de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Consulta primero en tabla USERS
  const userQuery = 'SELECT * FROM USERS WHERE INSTITUTIONAL_EMAIL = ? AND PASSWORD = ?';
  base_datos.query(userQuery, [email, password], (err, resultsUser) => {
    if (err) return res.status(500).json({ success: false, message: 'Error en servidor' });

    if (resultsUser.length > 0) {
      return res.json({
        success: true,
        role: 'usuario',
        data: resultsUser[0]
      });
    }

    // Si no es usuario, consulta en EMPLOYEES_CAFE
    const empQuery = 'SELECT * FROM EMPLOYEES_CAFE WHERE EMAIL = ? AND PASSWORD = ?';
    base_datos.query(empQuery, [email, password], (err, resultsEmp) => {
      if (err) return res.status(500).json({ success: false, message: 'Error en servidor' });

      if (resultsEmp.length > 0) {
        return res.json({
          success: true,
          role: 'empleado',
          data: resultsEmp[0]
        });
      }

      // Si no se encuentra en ninguna tabla
      return res.json({ success: false, message: 'Credenciales incorrectas' });
    });
  });
});

app.listen(3000, () => {
  console.log('Servidor backend corriendo en puerto 3000');
});