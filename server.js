import 'dotenv/config';
import express from 'express';
import connectDB from './src/config/database.config.js';

import authRoutes from './src/routes/auth.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import userRoutes from './src/routes/user.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './src/swagger.js';
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Welcome to Recipe Hub API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Vercel deployment ke liye app ko export karna zaroori hai
export default app;