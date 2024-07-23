import { Router } from 'express';
import { registerController } from '../controllers/register.controller.js';

const router = Router();

// Ruta para obtener máquinas asignadas por id_usuarioAsignado
router.get('/user-machines/:id_usuarioAsignado', registerController.getUserMachines);

router.get('/user-machines', registerController.getRegisters);

router.post('/user-machines', registerController.createRegisters);


export default router;