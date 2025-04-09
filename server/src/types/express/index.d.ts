declare namespace Express {
  interface Request {
    user?: {
      username: string;
    };
  }
}

declare module 'bcrypt';
declare module 'cors';
declare module 'jsonwebtoken';
