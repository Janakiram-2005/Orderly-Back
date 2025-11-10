import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import axios from 'axios'; // 2. Import axios for API calls

// 3. Import React-Bootstrap components
import { Container, Card, Form, Button, Image, Alert, Spinner } from 'react-bootstrap';

// --- Global Styles ---
// This contains the font, new button styles, and the toggle animation
const GlobalStyles = () => (
  <style type="text/css">{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    
    body, .auth-page {
      font-family: 'Inter', sans-serif;
      background-color: #f8f9fa;
    }

    /* --- Brand Colors --- */
    .btn.btn-brand {
      background-color: #6c56d0;
      border-color: #6c56d0;
      color: #fff;
      font-weight: 500;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    .btn.btn-brand:hover {
      background-color: #5a48b0;
      border-color: #5a48b0;
      color: #fff;
    }
    .text-brand {
      color: #6c56d0 !important;
      font-weight: 500;
    }
    .form-check-input:checked {
      background-color: #6c56d0;
      border-color: #6c56d0;
    }
    .form-control:focus {
      border-color: #6c56d0;
      box-shadow: 0 0 0 3px rgba(108, 86, 208, 0.2);
      outline: none;
    }

    /* --- Sliding Toggle Animation --- */
    .auth-toggle-group {
      position: relative;
      display: flex;
      width: 100%;
      background-color: #e9ecef; /* The grey pill bg */
      border-radius: 999px;
      padding: 0.25rem; /* 4px padding */
    }

    .toggle-slider {
      position: absolute;
      top: 0.25rem;
      bottom: 0.25rem;
      left: 0.25rem;
      width: calc(50% - 0.25rem); /* 50% minus left padding */
      background-color: #fff;
      border-radius: 999px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      transform: translateX(0%);
    }
    
    .auth-toggle-group.signup-active .toggle-slider {
      transform: translateX(100%);
    }

    .auth-toggle-btn {
      width: 50%;
      border-radius: 999px;
      font-weight: 500;
      transition: color 0.3s ease;
      border: none;
      background-color: transparent;
      color: #6c757d; /* Muted color for inactive */
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      z-index: 2; /* Make sure buttons are on top of the slider */
    }
    
    .auth-toggle-btn.active {
      color: #333; /* Dark color for active */
    }
  `}</style>
);


// --- 1. The Admin Login Form ---
const AdminLoginForm = ({ setIsLoginView }) => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  // State for controlled form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the backend login endpoint
      console.log('Attempting login with:', { email });
      const res = await axios.post('/api/auth/admin/login', { email, password });
      console.log('Server response:', res.data);

      if (!res.data || !res.data.token) {
        console.error('Missing token in response:', res.data);
        throw new Error('Invalid response from server');
      }

      const { token, ...userData } = res.data;
      console.log('Processed user data:', { userData, hasToken: !!token });
      
      // Only call login if we have both userData and token
      if (userData && token) {
        login(userData, token);
        console.log('Login successful, redirecting...');
        navigate('/admin/dashboard'); // Redirect to the admin dashboard
      } else {
        console.error('Invalid login data:', { userData, hasToken: !!token });
        throw new Error('Invalid login data received');
      }
      // ⭐️ --- END OF FIX --- ⭐️
      
      navigate('/admin/dashboard'); // Redirect to the admin dashboard

    } catch (err) {
      // Set error message from API response or a default
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="fw-semibold mb-2">
        Admin Panel Login
      </h3>
      <p className="text-muted mb-4">
        Welcome, Admin! Please enter your details.
      </p>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label className="fw-medium">Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label className="fw-medium">Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="•••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <Form.Check 
            type="checkbox" 
            label="Remember me"
            id="remember-me"
            disabled={loading}
          />
          <a 
            href="#" 
            className="small text-decoration-none text-brand"
          >
            Forgot password
          </a>
        </div>

        <Button 
          type="submit" 
          className="w-100 btn-brand"
          disabled={loading}
        >
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            'Sign in'
          )}
        </Button>
      </Form>

      <p className="text-center small text-muted mt-4 mb-0">
        Don't have an admin account?{' '}
        <Button 
          variant="link" 
          className="p-0 small text-brand" 
          onClick={() => setIsLoginView(false)}
        >
          Register
        </Button>
      </p>
    </>
  );
};

// --- 2. The Admin Register Form (No changes needed) ---
const AdminRegisterForm = ({ setIsLoginView }) => {
  // Form field state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');

  // State for loading, error, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post('/api/auth/admin/register', {
        name,
        email,
        password,
        securityKey, // Send the key to the backend for validation
      });

      // Show success message from backend or a default
      setSuccess(res.data?.message || 'Admin registration successful! You can now log in.');
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setSecurityKey('');
      
      // Switch to login view after a delay
      setTimeout(() => {
        setIsLoginView(true);
      }, 2000);

    } catch (err) {
      // Show error message from backend
      setError(err.response?.data?.message || 'Invalid Security Key or Email. Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="fw-semibold mb-2">
        Register New Admin
      </h3>
      <p className="text-muted mb-4">
        Fill out the details to register a new admin.
      </p>

      {/* Message Alerts */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-3">
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="admin-name">
          <Form.Label className="fw-medium">Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="e.g., Jane Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-email">
          <Form.Label className="fw-medium">Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter admin email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-password">
          <Form.Label className="fw-medium">Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Create a strong password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="security-key">
          <Form.Label className="fw-medium">Security Key</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Enter the admin secret key"
            value={securityKey}
            onChange={(e) => setSecurityKey(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Button 
          type="submit" 
          className="w-100 mt-2 btn-brand"
          disabled={loading}
        >
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            'Register Admin'
          )}
        </Button>
      </Form>
      
      <p className="text-center small text-muted mt-4 mb-0">
        Already have an admin account?{' '}
        <Button 
          variant="link" 
          className="p-0 small text-brand" 
          onClick={() => setIsLoginView(true)}
        >
          Log in
        </Button>
      </p>
    </>
  );
};

// --- 3. The Main Admin Page Component (Wrapper) ---
const AdminAuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const placeholderLogo = "https://placehold.co/64x64/6c56d0/white?text=A";

  return (
    // Use Bootstrap container for responsive layout and background color
    <div className="min-vh-100 d-flex justify-content-center align-items-start py-4 py-md-5 auth-page">
      
      <GlobalStyles />
      
      {/* Use Bootstrap Card for the auth form */}
      <Card 
        className="w-100 border-0 shadow-sm" 
        style={{ maxWidth: '450px', borderRadius: '0.75rem' }}
      >
        <Card.Body className="p-4 p-sm-5">
          
          <div className="d-flex justify-content-center mb-4">
            <Image 
              src="/orderly.jpg" 
              alt="Orderly Logo"
              onError={(e) => { e.target.onerror = null; e.target.src = placeholderLogo; }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          {/* The "Sign up" / "Log in" Toggle */}
          <div 
            className={`auth-toggle-group ${!isLoginView ? 'signup-active' : ''}`}
          >
            {/* This div is the white background that slides */}
            <div className="toggle-slider"></div>
            
            <Button
              className={`auth-toggle-btn ${isLoginView ? 'active' : ''}`}
              onClick={() => setIsLoginView(true)}
              variant="link"
            >
              Log in
            </Button>
            <Button
              className={`auth-toggle-btn ${!isLoginView ? 'active' : ''}`}
              onClick={() => setIsLoginView(false)}
              variant="link"
            >
              Register
            </Button>
          </div>

          <div className="mt-4">
            {/* --- Conditionally render the correct form --- */}
            {isLoginView 
              ? <AdminLoginForm setIsLoginView={setIsLoginView} /> 
              : <AdminRegisterForm setIsLoginView={setIsLoginView} />
            }
          </div>

        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminAuthPage;