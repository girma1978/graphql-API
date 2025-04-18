import { Book, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';
import fetch from 'node-fetch'; // You'll need to install this package
const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (_parent, { username }) => {
            return User.findOne({ username });
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
        books: async () => {
            return await Book.find();
        },
        book: async (_parent, { bookId }) => {
            return await Book.findOne({ bookId });
        },
        searchGoogleBooks: async (_parent, { searchTerm }) => {
            try {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) {
                    throw new Error('Google Books API request failed');
                }
                return await response.json();
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to search Google Books');
            }
        },
    },
    Mutation: {
        addUser: async (_parent, { input }) => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (_parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId } } }, { new: true });
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};
export default resolvers;
