import express from 'express';
import path from 'node:path';
import { Request, Response } from 'express';
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

  // Updated CORS configuration to allow requests from your static site URL
  app.use(cors({
    origin: ['http://localhost:3000', 'https://graphql-api-1.onrender.com'],
    methods: ['GET', 'POST'],
    credentials: true,
  }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Health check endpoint for monitoring
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'up', timestamp: new Date().toISOString() });
  });

  app.use('/graphql', expressMiddleware(server as any, {
    context: async ({ req }) => {
      const authResult = authenticateToken({ req });
      return { user: authResult.user }; 
    },
  }));

  // Since client is deployed separately, we don't need to serve static files
  // This simple route replaces the static file serving
  if (process.env.NODE_ENV === 'production') {
    app.get('/', (_req: Request, res: Response) => {
      res.json({ message: 'API server running' });
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running`);
    console.log(`GraphQL at https://graphql-api-8rbg.onrender.com/graphql`);
  });
};

startApolloServer();