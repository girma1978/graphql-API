import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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
  
  // Updated CORS configuration to allow requests from both local development and production URL
  const allowedOrigins = [
    'http://localhost:3000',
    'https://graphql-api-1.onrender.com'
  ];
  
  app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
    // Correcting path resolution for production environment
    const clientDistPath = path.resolve(__dirname, '../client/dist');
    
    // Log the path for debugging
    console.log('Client dist path:', clientDistPath);
    
    // Serve static files from client build
    app.use(express.static(clientDistPath));
    
    // Catch-all route to serve the index.html for any route that isn't an API endpoint
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(clientDistPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`GraphQL available at ${process.env.NODE_ENV === 'production' ? 
      'https://graphql-api-1.onrender.com/graphql' : 
      `server started`}`);
  });
};

startApolloServer();
