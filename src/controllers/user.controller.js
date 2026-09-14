import { searchRecipes, getRecipeById } from '../models/recipe.model.js';
import { chatAboutRecipe } from '../ai/groq.service.js';

// @desc    Get all recipes or search recipes by name/description
// @route   GET /api/user/recipes
// @access  Private
export const getRecipes = async (req, res) => {
    try {
        const keyword = req.query.search || '';
        const recipes = await searchRecipes(keyword);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Chat with AI about a specific recipe
// @route   POST /api/user/recipes/:id/chat
// @access  Private
export const recipeChat = async (req, res) => {
    try {
        const { question } = req.body;
        const recipeId = req.params.id;

        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        const recipe = await getRecipeById(recipeId);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const aiResponse = await chatAboutRecipe(recipe, question);

        res.status(200).json({
            recipeId,
            question,
            answer: aiResponse
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
