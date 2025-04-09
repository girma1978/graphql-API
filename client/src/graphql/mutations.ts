// // client/src/graphql/mutations.ts
// import { gql } from '@apollo/client';

// // Mutation for logging in a user
// export const LOGIN_USER = gql`
//   mutation loginUser($email: String!, $password: String!) {
//     login(email: $email, password: $password) {
//       token
//       user {
//         _id
//         username
//         email
//         bookCount
//         savedBooks {
//           bookId
//           authors
//           description
//           title
//           image
//           link
//         }
//       }
//     }
//   }
// `;

// // Mutation for creating a new user (sign-up)
// export const CREATE_USER = gql`
//   mutation createUser($username: String!, $email: String!, $password: String!) {
//     addUser(username: $username, email: $email, password: $password) {
//       token
//       user {
//         _id
//         username
//         email
//         bookCount
//         savedBooks {
//           bookId
//           authors
//           description
//           title
//           image
//           link
//         }
//       }
//     }
//   }
// `;

// // Mutation for saving a book to the user's account
// export const SAVE_BOOK = gql`
//   mutation saveBook($bookData: BookInput!) {
//     saveBook(bookData: $bookData) {
//       _id
//       username
//       email
//       bookCount
//       savedBooks {
//         bookId
//         authors
//         description
//         title
//         image
//         link
//       }
//     }
//   }
// `;

// // Mutation for removing a saved book from the user's account
// export const REMOVE_BOOK = gql`
//   mutation removeBook($bookId: ID!) {
//     removeBook(bookId: $bookId) {
//       _id
//       username
//       email
//       bookCount
//       savedBooks {
//         bookId
//         authors
//         description
//         title
//         image
//         link
//       }
//     }
//   }
// `;


// client/src/graphql/mutations.ts
import { gql } from '@apollo/client';

// Mutation for logging in a user
export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          bookId
          authors
          description
          title
          image
          link
        }
      }
    }
  }
`;

// Mutation for creating a new user (sign-up)
export const CREATE_USER = gql`
  mutation createUser($input: UserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          bookId
          authors
          description
          title
          image
          link
        }
      }
    }
  }
`;

// Mutation for saving a book to the user's account
export const SAVE_BOOK = gql`
  mutation saveBook($input: BookInput!) {
    saveBook(input: $input) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

// Mutation for removing a saved book from the user's account
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;