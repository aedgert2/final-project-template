import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as itemController from '../controllers/itemController.js';

const router = Router();

// Read: any authenticated user
router.get('/', authenticate, itemController.getAllItems);
router.get('/:id', authenticate, itemController.getItemById);

// Write: admin only
router.post('/', authenticate, requireAdmin, itemController.createItem);
router.put('/:id', authenticate, requireAdmin, itemController.updateItem);
router.delete('/:id', authenticate, requireAdmin, itemController.deleteItem);

export default router;