// import { Book, User } from '../models/index.js';
// import { signToken, AuthenticationError } from '../services/auth.js';

// // Define types for the arguments
// interface AddUserArgs {
//   input: {
//     username: string;
//     email: string;
//     password: string;
//   };
// }

// interface LoginUserArgs {
//   email: string;
//   password: string;
// }

// interface UserArgs {
//   username: string;
// }

// interface BookArgs {
//   bookId: string;
// }


// const resolvers = {
//   Query: {
//     users: async () => {
//       return User.find();
//     },
//     user: async (_parent: any, { username }: UserArgs) => {
//       return User.findOne({ username });
//     },
//     me: async (_parent: any, _args: any, context: any) => {
//       if (context.user) {
//         return User.findOne({ _id: context.user._id });
//       }
//       throw new AuthenticationError('Could not authenticate user.');
//     },
//     books: async () => {
//       return await Book.find();
//     },
//     book: async (_parent: any, { bookId }: BookArgs) => {
//       return await Book.findOne({ bookId });
//     },
//   },
//   Mutation: {
//     addUser: async (_parent: any, { input }: AddUserArgs) => {
//       const user = await User.create({ ...input });
//       const token = signToken(user.username, user.email, user._id);
//       return { token, user };
//     },

//     login: async (_parent: any, { email, password }: LoginUserArgs) => {
//       const user = await User.findOne({ email });
//       if (!user || !(await user.isCorrectPassword(password))) {
//         throw new AuthenticationError('Could not authenticate user.');
//       }
//       const token = signToken(user.username, user.email, user._id);
//       return { token, user };
//     },

//     // You can still keep saveBook and removeBook if those are used
//     // saveBook: ...
//     // removeBook: ...
//   },
// };

// export default resolvers;



import { Book, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';
import fetch from 'node-fetch'; // You'll need to install this package

// Define types for the arguments
interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface BookArgs {
  bookId: string;
}

interface SearchBooksArgs {
  searchTerm: string;
}

interface SaveBookArgs {
  input: {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image?: string;
    link?: string;
  }
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username });
    },
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
    books: async () => {
      return await Book.find();
    },
    book: async (_parent: any, { bookId }: BookArgs) => {
      return await Book.findOne({ bookId });
    },
    searchGoogleBooks: async (_parent: any, { searchTerm }: SearchBooksArgs) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}`
        );
        
        if (!response.ok) {
          throw new Error('Google Books API request failed');
        }
        
        return await response.json();
      } catch (error) {
        console.error(error);
        throw new Error('Failed to search Google Books');
      }
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Could not authenticate user.');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: any, { input }: SaveBookArgs, context: any) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
    removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;
