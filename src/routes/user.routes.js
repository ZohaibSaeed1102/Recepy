import express from 'express';
import { getRecipes, recipeChat } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All user routes must be protected (requires login)
router.use(protect);

router.get('/recipes', getRecipes);
router.post('/recipes/:id/chat', recipeChat);

export default router;
