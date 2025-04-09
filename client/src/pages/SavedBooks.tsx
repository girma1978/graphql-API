import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';

const SavedBooks = () => {
  // Check if user is logged in
  const token = Auth.loggedIn() ? Auth.getToken() : null;

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      window.location.assign('/login');
    }
  }, [token]);

  const { loading, error, data, refetch } = useQuery(GET_ME, {
    // Skip query if not logged in
    skip: !token,
    // Fetch fresh data when component mounts
    fetchPolicy: 'network-only'
  });

  const [removeBook, { loading: removeLoading }] = useMutation(REMOVE_BOOK, {
    // Refetch user data after removing a book
    onCompleted: () => {
      refetch();
    }
  });

  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    password: '', // Including this since it's required in your User type
    savedBooks: []
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (data && data.me) {
      setUserData(data.me);
    }
  }, [data]);

  // Handle book deletion
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      setErrorMessage('');
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (data) {
        // Update local state with updated user data after deletion
        setUserData(data.removeBook);
        // Remove book's id from localStorage
        removeBookId(bookId);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to delete the book. Please try again.');
    }
  };

  // If loading or error
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
          {userData.savedBooks && userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:` 
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks && userData.savedBooks.map((book) => (
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