const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

// Crear la base de datos en memoria
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Crear la tabla de citas
  db.run("CREATE TABLE appointments (name TEXT, email TEXT, date TEXT, time TEXT)");
});

app.use(express.static('public'));
app.use(express.json());

// Ruta para agregar una cita
app.post('/api/appointments', (req, res) => {
  const { name, email, date, time } = req.body;
  db.run("INSERT INTO appointments (name, email, date, time) VALUES (?, ?, ?, ?)", [name, email, date, time], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al guardar la cita' });
    }
    res.json({ success: true });
  });
});

// Ruta para obtener todas las citas
app.get('/api/appointments', (req, res) => {
  db.all("SELECT * FROM appointments", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al leer las citas' });
    }
    res.json({ success: true, appointments: rows });
  });
});

// Ruta para ver las citas programadas
app.get('/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'appointments.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
