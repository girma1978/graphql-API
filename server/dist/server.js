import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import cors from 'cors'; // Import cors
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startApolloServer = async () => {
    await server.start();
    await db(); // Ensure DB connection works or handle connection errors.
    const PORT = process.env.PORT || 4000;
    const app = express();
    // Enable CORS
    app.use(cors({
        origin: 'http://localhost:3000', // Adjust this to your frontend's URL (e.g., Vite's local dev server)
        methods: ['GET', 'POST'], // Allow specific methods (GET, POST, etc.)
        credentials: true, // If you need to handle cookies or authorization headers
    }));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    // Set up the GraphQL server middleware
    app.use('/graphql', expressMiddleware(server, {
        context: authenticateToken, // Ensure authenticateToken properly handles context.
    }));
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html')); // Ensure the correct path.
        });
    }
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
startApolloServer();
