import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as characterController from '../controllers/characterController.js';

const router = Router();

// All character routes require authentication
router.use(authenticate);

router.post('/', characterController.createCharacter);
router.get('/', characterController.getMyCharacters);
router.get('/:id', characterController.getCharacterById);
router.put('/:id', characterController.updateCharacter);
router.delete('/:id', characterController.deleteCharacter);

// Character item sub-routes
router.post('/:id/items', characterController.addItem);
router.delete('/:id/items/:itemId', characterController.removeItem);

export default router;