import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws; // Use WebSocket to bypass port 5432 blocking

let pool;

const connectDB = async () => {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/recipehub',
            ssl: {
                rejectUnauthorized: false
            }
        });

        // Test connection
        const client = await pool.connect();
        console.log(`PostgreSQL Connected: ${client.host}`);
        
        // Initialize tables
        await initTables(client);
        
        client.release();
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
        process.exit(1);
    }
};

const initTables = async (client) => {
    // Create Users table
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            _id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Create Recipes table
    await client.query(`
        CREATE TABLE IF NOT EXISTS recipes (
            _id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            ingredients JSONB NOT NULL,
            instructions JSONB NOT NULL,
            created_by VARCHAR(255) REFERENCES users(_id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log('PostgreSQL Tables Initialized');
};

export const getPool = () => {
    if (!pool) {
        throw new Error('Database pool not initialized');
    }
    return pool;
};

export default connectDB;