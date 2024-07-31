import { Router } from "express";
import { userLoginController } from "../controllers/login.controller.js";

const router = Router();

// router.get("/login", userLoginController.getLogin);
router.post("/login", userLoginController.authLogin);


export default router;