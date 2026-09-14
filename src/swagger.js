import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read YAML files
const adminDocsPath = path.join(__dirname, 'docs', 'admin.docs.yaml');
const userDocsPath = path.join(__dirname, 'docs', 'user.docs.yaml');

const adminDocs = yaml.parse(fs.readFileSync(adminDocsPath, 'utf8'));
const userDocs = yaml.parse(fs.readFileSync(userDocsPath, 'utf8'));

// Merge paths
const paths = {
    ...adminDocs.paths,
    ...userDocs.paths
};

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Recipe Hub API',
        version: '1.0.0',
        description: 'API Documentation for Recipe Hub (Admin & User)',
    },
    servers: [
        {
            url: 'https://recepyai-owk3bf2dl-zohaibsaeed1102s-projects.vercel.app',
            description: 'Production server (Vercel)',
        },
        {
            url: 'http://localhost:5000',
            description: 'Local server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: paths
};

export default swaggerDocument;
