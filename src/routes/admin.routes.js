import express from 'express';
import { generateRecipePreview, approveRecipe } from '../controllers/admin.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply protect and admin middlewares to all routes in this file
router.use(protect, admin);

router.post('/recipes/generate', generateRecipePreview);
router.post('/recipes/approve', approveRecipe);

export default router;
