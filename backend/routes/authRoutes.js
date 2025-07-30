import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { validateUserRegistration } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateUserRegistration, register);
router.post('/login', login);
router.get('/logout', logout);

export default router;
