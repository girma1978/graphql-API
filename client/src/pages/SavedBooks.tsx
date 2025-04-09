import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';

const SavedBooks = () => {
  // State for user data
  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    password: '', // Including this since it's required in your User type
    savedBooks: [],
  });
  // State for error messages
  const [errorMessage, setErrorMessage] = useState('');

  // Check if user is logged in and get the token
  const token = Auth.loggedIn() ? Auth.getToken() : null;

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      window.location.assign('/login');
    }
  }, [token]);

  // GraphQL query to get the logged-in user's data
  const { loading, error, data, refetch } = useQuery(GET_ME, {
    skip: !token, // Skip the query if there's no token
    fetchPolicy: 'network-only', // Always fetch fresh data from the server
  });

  // GraphQL mutation to remove a book
  const [removeBook, { loading: removeLoading }] = useMutation(REMOVE_BOOK, {
    onCompleted: (data) => {
      // After successful removal, update the local state and refetch user data
      if (data?.removeBook) {
        // Ensure savedBooks is always an array
        const updatedUser = {
          ...data.removeBook,
          savedBooks: data.removeBook.savedBooks || []
        };
        setUserData(updatedUser);
        refetch(); // Re-run GET_ME to update the book list
      }
    },
    onError: (err) => {
      console.error('Error removing book:', err);
      setErrorMessage('Failed to delete the book. Please try again.');
    },
  });

  // Update local state when user data from the query arrives
  useEffect(() => {
    if (data?.me) {
      // Ensure savedBooks is always an array even if it's null from the server
      const updatedUser = {
        ...data.me,
        savedBooks: data.me.savedBooks || []
      };
      setUserData(updatedUser);
    }
  }, [data]);

  // Function to handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      setErrorMessage('');
      await removeBook({
        variables: { bookId },
      });

      // Remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
      // The useMutation's onError handler should already be setting the error message
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="mt-3">Loading your saved books...</h2>
      </Container>
    );
  }

  // Handle error state
  if (error) {
    console.error(error);
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Error loading your saved books: {error.message}
        </Alert>
      </Container>
    );
  }

  // Get the savedBooks array (with null handling)
  const savedBooks = userData.savedBooks || [];

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        {errorMessage && (
          <Alert
            variant="danger"
            onClose={() => setErrorMessage('')}
            dismissible
            className="mt-3"
          >
            {errorMessage}
          </Alert>
        )}

        <h2 className='pt-5'>
          {savedBooks.length
            ? `Viewing ${savedBooks.length} saved ${
                savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {savedBooks.map((book) => (
            <Col md='4' key={book.bookId} className="mb-4">
              <Card border='dark' className="h-100">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant='top'
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-light text-center p-5">No image available</div>
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>
                    Authors: {Array.isArray(book.authors)
                      ? book.authors.join(', ')
                      : book.authors || 'Unknown'}
                  </p>
                  <Card.Text className="flex-grow-1">{book.description}</Card.Text>
                  <Button
                    className='btn-block btn-danger mt-auto'
                    onClick={() => handleDeleteBook(book.bookId)}
                    disabled={removeLoading}
                  >
                    {removeLoading ? 'Deleting...' : 'Delete this Book!'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;