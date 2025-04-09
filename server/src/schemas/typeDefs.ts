

const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  input BookInput {
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type GoogleBookResult {
    items: [GoogleBook]
  }

  type GoogleBook {
    id: String
    volumeInfo: VolumeInfo
  }

  type VolumeInfo {
    title: String
    authors: [String]
    description: String
    imageLinks: ImageLinks
  }

  type ImageLinks {
    thumbnail: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    books: [Book]
    book(bookId: String!): Book
    searchGoogleBooks(searchTerm: String!): GoogleBookResult
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput!): User 
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;