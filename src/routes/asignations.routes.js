import { Router } from 'express';
import { asignamentsController } from '../controllers/assignaments.controller.js';

const router = Router();

router.get('/assignaments', asignamentsController.getAsignaciones);
router.get('/assignaments/:id_usuarioAsignado', asignamentsController.getAsignacionesByUser);
router.post('/assignaments', asignamentsController.createAsignacion);
router.patch('/assignaments/:id_usuarioAsignado', asignamentsController.updateAsignacion);
router.delete('/assignaments/:id_usuarioAsignado', asignamentsController.deleteAsignacion);

export default router;
