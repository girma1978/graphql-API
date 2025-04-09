
import { gql } from '@apollo/client'
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
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

export const SEARCH_GOOGLE_BOOKS = gql`
  query SearchGoogleBooks($searchTerm: String!) {
    searchGoogleBooks(searchTerm: $searchTerm) {
      items {
        id
        volumeInfo {
          title
          authors
          description
          imageLinks {
            thumbnail
          }
        }
      }
    }
  }
`;