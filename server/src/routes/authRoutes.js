import express from 'express';
import { changePassword, login, me, register, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { changePasswordRules, loginRules, registerRules } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, me);
router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, changePasswordRules, validate, changePassword);

export default router;
