import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import Auth from '../utils/auth';

// Define the mutation directly in the component for debugging
// This ensures we're using exactly the right structure
const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

const SignupForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Something went wrong with your signup!');

  // Apollo mutation hook
  const [createUser, { loading }] = useMutation(CREATE_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if form is valid
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setShowAlert(false);
      
      // Create the variables object with the exact structure expected
      const variables = {
        input: {
          username: userFormData.username,
          email: userFormData.email,
          password: userFormData.password,
        },
      };
      
      // Log the exact mutation and variables being sent (for debugging)
      console.log('Mutation being sent:', CREATE_USER.loc?.source.body);
      console.log('Variables being sent:', JSON.stringify(variables, null, 2));
      
      const { data } = await createUser({ variables });

      console.log('Response received:', JSON.stringify(data, null, 2));

      if (!data || !data.addUser) {
        throw new Error('No data returned from server');
      }

      Auth.login(data.addUser.token);
      handleModalClose();
    } catch (err: any) {
      console.error('Full error object:', err);
      
      if (err.graphQLErrors) {
        console.error('GraphQL Errors:', JSON.stringify(err.graphQLErrors, null, 2));
      }
      
      if (err.networkError) {
        console.error('Network Error:', err.networkError);
        if (err.networkError.result) {
          console.error('Error result:', JSON.stringify(err.networkError.result, null, 2));
        }
      }
      
      setErrorMessage(err.message || 'An unknown error occurred');
      setShowAlert(true);
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
          {errorMessage}
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
            minLength={5}
          />
          <Form.Control.Feedback type="invalid">Password must be at least 5 characters!</Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password) || loading}
          type="submit"
          variant="success"
        >
          {loading ? 'Signing up...' : 'Submit'}
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;