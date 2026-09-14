import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

export const generateRecipeFromAI = async (name, description) => {
    try {
        const llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "openai/gpt-oss-120b",
            temperature: 0.7,
        });

        const prompt = PromptTemplate.fromTemplate(`
You are a professional chef. I want you to create a recipe for a dish named "{name}".
Here is a brief description of the dish: {description}.

Please provide a list of ingredients and a step-by-step list of instructions.
Respond ONLY with a valid JSON object in the following format:
{{
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"]
}}
Do not include any extra text, markdown formatting, or explanations. Just output the raw JSON object.
`);

        const chain = prompt.pipe(llm);
        const response = await chain.invoke({
            name: name,
            description: description
        });

        let content = response.content.trim();

        // Remove markdown formatting if the model accidentally included it
        if (content.startsWith('\`\`\`json')) {
            content = content.replace('\`\`\`json', '').replace('\`\`\`', '').trim();
        } else if (content.startsWith('\`\`\`')) {
            content = content.replace('\`\`\`', '').replace('\`\`\`', '').trim();
        }

        const jsonResult = JSON.parse(content);
        return jsonResult;

    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate recipe from AI");
    }
};

export const chatAboutRecipe = async (recipe, userQuestion) => {
    try {
        const llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "openai/gpt-oss-120b",
            temperature: 0.7,
        });

        const prompt = PromptTemplate.fromTemplate(`
You are a helpful culinary AI assistant. You are helping a user understand a specific recipe.

Recipe Details:
- Name: {name}
- Description: {description}
- Ingredients: {ingredients}
- Instructions: {instructions}

The user has asked the following question about this recipe:
"{question}"

Please provide a clear and concise answer based strictly on the recipe details provided.
`);

        const chain = prompt.pipe(llm);
        const response = await chain.invoke({
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients.join(', '),
            instructions: recipe.instructions.join(' '),
            question: userQuestion
        });

        return response.content.trim();

    } catch (error) {
        console.error("AI Chat Error:", error);
        throw new Error("Failed to chat with AI about recipe");
    }
};
