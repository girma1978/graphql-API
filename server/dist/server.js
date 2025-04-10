import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import cors from 'cors';
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startApolloServer = async () => {
    await server.start();
    await db();
    const PORT = process.env.PORT || 4000;
    const app = express();
    app.use(cors({
        origin: process.env.NODE_ENV === 'production'
            ? true // Allow requests from any origin in production
            : 'http://localhost:3000', // Local development origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => {
            const authResult = authenticateToken({ req });
            return { user: authResult.user };
        },
    }));
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
startApolloServer();
