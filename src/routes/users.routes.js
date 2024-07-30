import { Router } from 'express';
import { userController } from '../controllers/users.controller.js'

const router = Router();

router.get('/users', userController.getUsers)

router.get('/users/:id', userController.getUser);

router.post('/users', userController.createUser);

router.patch('/users/:id_usuarios', userController.updateUser);

router.delete('/users/:id_usuarios', userController.deleteUser);








export default router;