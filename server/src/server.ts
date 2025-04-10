import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import cors from 'cors';

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a request type with the properties we need
interface MyRequest extends Request {
  // Add any custom properties you might be using from req
}

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
      ? true  // Allow requests from any origin in production
      : 'http://localhost:3000', // Local development origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
  
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }: { req: MyRequest }) => {
      const authResult = authenticateToken({ req });
      return { user: authResult.user }; 
    },
  }));
  
  if (process.env.NODE_ENV === 'production') {
    // Updated path to match Render's file structure
    app.use(express.static(path.join(__dirname, 'client/dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'client/dist/index.html'));
    });
  }
  
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();