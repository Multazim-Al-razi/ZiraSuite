import express from 'express';
import { login, logout } from '../src/controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', requireAuth, logout);

export default router;