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
import fs from 'fs';

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug logs
console.log('Current working directory:', process.cwd());
console.log('__dirname location:', __dirname);

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
    // Look for client files in the copied location (from copy-client script)
    const clientPath = path.join(__dirname, 'client');
    
    console.log('Looking for client files at:', clientPath);
    
    // Check if the path exists
    if (fs.existsSync(clientPath)) {
      console.log('Client directory found!');
    } else {
      console.log('Client directory NOT found. Files in current directory:', 
                  fs.readdirSync(__dirname));
      
      // Try alternative paths
      const altPaths = [
        path.join(process.cwd(), 'client'),
        path.join(__dirname, '../../client/dist'),
        path.join(process.cwd(), '../client/dist')
      ];
      
      for (const altPath of altPaths) {
        try {
          if (fs.existsSync(altPath)) {
            console.log(`Found client at alternative path: ${altPath}`);
            // Override clientPath with the found path
            app.use(express.static(altPath));
            app.get('*', (_req: Request, res: Response) => {
              res.sendFile(path.join(altPath, 'index.html'));
            });
            // Exit the loop and the if-else block
            return;
          }
        } catch (err) {
          // Continue to next path
        }
      }
      
      console.log('Could not find client files in any expected location');
    }
    
    // Only execute this if we found the primary client path
    app.use(express.static(clientPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  }
  
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();