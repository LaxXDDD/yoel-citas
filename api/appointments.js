const fs = require('fs');
const path = require('path');

const appointmentsFile = path.join(__dirname, '..', 'appointments.txt');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { name, email, date, time } = JSON.parse(body);
      const appointment = { name, email, date, time };

      fs.appendFile(appointmentsFile, JSON.stringify(appointment) + '\n', (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error al guardar la cita' });
        }
        res.json({ success: true });
      });
    });
  } else if (req.method === 'GET') {
    fs.readFile(appointmentsFile, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al leer las citas' });
      }

      const appointments = data.split('\n').filter(line => line).map(line => JSON.parse(line));
      res.json({ success: true, appointments });
    });
  } else {
    res.status(405).json({ success: false, message: 'Método no permitido' });
  }
};
