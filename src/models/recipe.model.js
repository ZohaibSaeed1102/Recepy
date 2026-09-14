import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../config/database.config.js';

export const createRecipe = async (recipeData) => {
    const { name, description, ingredients, instructions, createdBy } = recipeData;
    const pool = getPool();
    
    const docId = `recipe::${uuidv4()}`;
    
    const query = `
        INSERT INTO recipes (_id, name, description, ingredients, instructions, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    
    const values = [
        docId,
        name,
        description,
        JSON.stringify(ingredients),
        JSON.stringify(instructions),
        createdBy
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getRecipeById = async (id) => {
    const pool = getPool();
    
    const query = `SELECT * FROM recipes WHERE _id = $1`;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
        return null;
    }
    
    return result.rows[0];
};

export const searchRecipes = async (keyword = '') => {
    const pool = getPool();
    
    let query;
    let values = [];
    
    if (keyword) {
        query = `
            SELECT * FROM recipes 
            WHERE name ILIKE $1 OR description ILIKE $1
            ORDER BY created_at DESC
        `;
        values = [`%${keyword}%`];
    } else {
        query = `SELECT * FROM recipes ORDER BY created_at DESC`;
    }

    const result = await pool.query(query, values);
    return result.rows;
};
