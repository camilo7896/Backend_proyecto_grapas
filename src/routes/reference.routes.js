import { Router } from 'express';
import { referenceController } from '../controllers/reference.controller.js';

const router = Router();

router.get('/reference', referenceController.getReferences)

  router.get('/reference/:id', referenceController.getReference);

 router.post('/reference', referenceController.createreference);

 router.patch('/reference/:id_referencia', referenceController.updateReference);

 router.delete('/reference/:id_referencia', referenceController.deleteRereference);

export default router;