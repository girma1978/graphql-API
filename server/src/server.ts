import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import cors from 'cors';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any, {
    context: async ({ req }) => {
      const authResult = authenticateToken({ req });
      return { user: authResult.user }; 
    },
  }));

  if (process.env.NODE_ENV === 'production') {
    // Use process.cwd() instead of __dirname
    const clientDistPath = path.resolve(process.cwd(), '../client/dist');
    
    // Check if the directory exists before trying to serve from it
    if (fs.existsSync(clientDistPath)) {
      app.use(express.static(clientDistPath));
      
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(clientDistPath, 'index.html'));
      });
    } else {
      console.log('Client/dist directory not found. Serving API only.');
    }
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();