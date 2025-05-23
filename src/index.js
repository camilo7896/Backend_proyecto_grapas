import express from 'express';
import usersRoutes from './routes/users.routes.js';
import indexRoutes from './routes/index.routes.js';
import machineRoutes from './routes/machine.routes.js';
import referenceRoutes from './routes/reference.routes.js';
import asignationsRoutes from './routes/asignations.routes.js';
import registerRoutes from './routes/register.routes.js';
import loginRoutes from './routes/login.route.js';

//dotenv

import dotenv from 'dotenv';
dotenv.config();

import { PORT } from './config.js';
import cors from 'cors';


const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Asegúrate de llamar a cors()

// Routes
app.use('/api', usersRoutes);
app.use('/api', indexRoutes);
app.use('/api', machineRoutes);
app.use('/api', referenceRoutes);
app.use('/api', asignationsRoutes);
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
