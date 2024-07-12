import { Router } from "express";
import { machineController } from "../controllers/machine.controller.js";

const router = Router();

router.get("/machines", machineController.getMachines);

router.get("/machines/:id", machineController.getMachine);

router.post("/machines", machineController.createMachine);

router.patch("/machines/:id_maquinas", machineController.updateMachine);

router.delete("/machines/:id_maquinas", machineController.deleteMachine);

export default router;