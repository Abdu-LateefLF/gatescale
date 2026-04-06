import { Router } from "express";
import authController from "../controllers/auth.controller";
import validateBody from "../middleware/validateBody";
import { registerSchema } from "../schemas/auth.schema";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/login", validateBody(loginSchema), authController.login);

router.post("/register", validateBody(registerSchema), authController.register);

export default router;