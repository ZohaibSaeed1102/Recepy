import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../config/database.config.js';

export const createUser = async (userData) => {
    const { name, email, password, role } = userData;
    const pool = getPool();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const docId = `user::${uuidv4()}`;

    const query = `
        INSERT INTO users (_id, name, email, password, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING _id, name, email, role, created_at;
    `;
    const values = [docId, name, email, hashedPassword, role || 'user'];

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getUserByEmail = async (email) => {
    const pool = getPool();
    
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
        return null;
    }
    
    return result.rows[0];
};

export const getUserById = async (id) => {
    const pool = getPool();
    
    const query = `SELECT _id, name, email, role, created_at FROM users WHERE _id = $1`;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
        return null;
    }
    
    return result.rows[0];
};

export const matchPassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};
