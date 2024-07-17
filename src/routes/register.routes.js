import { Router } from 'express';
import { registerController } from '../controllers/register.controller.js';

const router = Router();

router.post('user-machines/:id_usuarios', registerController.registerdata);

export default router;