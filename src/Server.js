// server.js (Backend)
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Para manejar CORS si es necesario
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'https://prueba-scanner.vercel.app/',
    methods: ['GET', 'POST'], 
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Ruta para guardar datos
app.post('/api/save', (req, res) => {
  const { name, timestamp } = req.body;

  // Aquí agregarías la lógica para guardar en la base de datos
  console.log(`Nombre: ${name}, Hora: ${timestamp}`);

  // Simulación de guardado exitoso
  res.status(200).json({ message: 'Datos guardados con éxito' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
