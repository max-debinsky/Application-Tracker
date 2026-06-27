import { Router } from "express";
import * as authController from "./auth.controller.js";
import authenticate from '../../middleware/authenticate.js';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authenticate, authController.me);

export default router;