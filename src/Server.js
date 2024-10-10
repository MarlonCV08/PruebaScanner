// server.js (Backend)
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Para manejar CORS si es necesario

const app = express();
const PORT = 5000;

const corsOptions = {
    origin: 'http://localhost:5173', // Asegúrate de que este sea el origen correcto de tu frontend
    methods: ['GET', 'POST'],
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Ruta para guardar datos
app.post('/api/save', (req, res) => {
  const { name, timestamp } = req.body;

  if (!name || !timestamp) {
    return res.status(400).json({ message: 'Faltan campos requeridos.' });
  }

  // Aquí agregarías la lógica para guardar en la base de datos
  console.log(`Nombre: ${name}, Hora: ${timestamp}`);

  // Simulación de guardado exitoso
  res.status(200).json({ message: 'Datos guardados con éxito' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
