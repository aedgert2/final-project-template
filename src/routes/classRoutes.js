import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as classController from '../controllers/classController.js';

const router = Router();

// Read: any authenticated user
router.get('/', authenticate, classController.getAllClasses);
router.get('/:id', authenticate, classController.getClassById);

// Write: admin only
router.post('/', authenticate, requireAdmin, classController.createClass);
router.put('/:id', authenticate, requireAdmin, classController.updateClass);
router.delete('/:id', authenticate, requireAdmin, classController.deleteClass);

export default router;