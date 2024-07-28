const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const appointmentsFile = path.join(__dirname, 'appointments.txt');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para guardar una nueva cita
app.post('/api/appointments', (req, res) => {
    const { name, email, date, time } = req.body;
    const appointment = { name, email, date, time };

    fs.appendFile(appointmentsFile, JSON.stringify(appointment) + '\n', (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al guardar la cita' });
        }
        res.json({ success: true });
    });
});

// Endpoint para obtener todas las citas
app.get('/api/appointments', (req, res) => {
    fs.readFile(appointmentsFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al leer las citas' });
        }

        const appointments = data.split('\n').filter(line => line).map(line => JSON.parse(line));
        res.json({ success: true, appointments });
    });
});

// Ruta para ver las citas programadas
app.get('/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'appointments.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
