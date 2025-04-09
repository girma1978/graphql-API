import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import Auth from '../utils/auth';

// Create a specific interface just for the login form
interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Something went wrong with your login credentials!');

  // Set up the Apollo useMutation hook
  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setShowAlert(false);
      
      // Use Apollo's useMutation to call the login mutation
      const { data } = await loginUser({
        variables: {
          email: userFormData.email,
          password: userFormData.password,
        },
      });

      if (!data || !data.login) {
        throw new Error('Something went wrong with the login!');
      }

      const { token } = data.login; // get token from the GraphQL response
      Auth.login(token); // Login the user with the token

      handleModalClose(); // Close the modal on successful login
    } catch (err) {
      console.error(err);
      
      // Set a more specific error message if available
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Something went wrong with your login credentials!');
      }
      
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
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email"
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
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>
        
        <Button 
          disabled={!(userFormData.email && userFormData.password) || loading} 
          type="submit" 
          variant="success"
        >
          {loading ? 'Logging in...' : 'Submit'}
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;