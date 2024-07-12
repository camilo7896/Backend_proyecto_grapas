import express from 'express';
import usersRoutes from './routes/users.routes.js';
import indexRoutes from './routes/index.routes.js';
import machineRoutes from './routes/machine.routes.js';
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


app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});
