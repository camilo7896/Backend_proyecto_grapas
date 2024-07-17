import { Router } from 'express';
import { asignamentsController } from '../controllers/assignaments.controller.js';

const router = Router();

router.get('/assignaments', asignamentsController.getAsignaciones);
router.get('/assignaments/:id_usuarioAsignado', asignamentsController.getAsignacionesByUser);
router.post('/assignaments', asignamentsController.createAsignacion);
router.post('/assignations/multiple', asignamentsController.createMultipleAsignaciones); // Nueva ruta para crear múltiples asignaciones
router.patch('/assignaments/:id_usuarioAsignado', asignamentsController.updateAsignacion);
router.delete('/assignaments/:id_usuarioAsignado', asignamentsController.deleteAsignacion);


router.get('/allassign', asignamentsController.getAllAsignaciones);
router.get('/allassign/:id', asignamentsController.getAsignacionById);
router.patch('/allassign/:id', asignamentsController.updateAsignacionById);
router.delete('/allassign/:id', asignamentsController.deleteAsignacionById);



export default router;
