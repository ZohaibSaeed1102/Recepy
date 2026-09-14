import { generateRecipeFromAI } from '../ai/groq.service.js';
import { createRecipe } from '../models/recipe.model.js';

// @desc    Generate recipe preview using AI
// @route   POST /api/admin/recipes/generate
// @access  Private/Admin
export const generateRecipePreview = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        const aiResponse = await generateRecipeFromAI(name, description);

        res.status(200).json({
            name,
            description,
            ingredients: aiResponse.ingredients,
            instructions: aiResponse.instructions
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve and save the generated recipe
// @route   POST /api/admin/recipes/approve
// @access  Private/Admin
export const approveRecipe = async (req, res) => {
    try {
        const { name, description, ingredients, instructions } = req.body;

        if (!name || !description || !ingredients || !instructions) {
            return res.status(400).json({ message: 'All recipe fields are required' });
        }

        const recipe = await createRecipe({
            name,
            description,
            ingredients,
            instructions,
            createdBy: req.user._id // from auth middleware
        });

        res.status(201).json(recipe);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
