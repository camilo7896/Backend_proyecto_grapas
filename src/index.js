import express from 'express';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT } from './config.js';
import usersRoutes from './routes/users.routes.js';
import indexRoutes from './routes/index.routes.js';
import machineRoutes from './routes/machine.routes.js';
import referenceRoutes from './routes/reference.routes.js';
import asignationsRoutes from './routes/asignations.routes.js';
import registerRoutes from './routes/register.routes.js';
import loginRoutes from './routes/login.route.js';

// Configurar dotenv
dotenv.config();

// Crear una instancia de Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Asegúrate de llamar a cors()

// Configurar las rutas
app.use('/api', usersRoutes);
app.use('/api', indexRoutes);
app.use('/api', machineRoutes);
app.use('/api', referenceRoutes);
app.use('/api', asignationsRoutes);
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);

// Configurar HTTPS
const options = {
  key: fs.readFileSync('./config/key.pem'),  // Ruta actualizada
  cert: fs.readFileSync('./config/cert.pem') // Ruta actualizada
};

// Crear el servidor HTTPS
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
