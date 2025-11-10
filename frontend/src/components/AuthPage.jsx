import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// ⭐️ MODIFIED: Added 'Alert' for error messages
import { Card, Form, Button, Image, Alert } from "react-bootstrap";
// ⭐️ MODIFIED: Added useAuth import
import { useAuth } from '../context/AuthContext.jsx'; 
// ⭐️ MODIFIED: Import axios to make real API calls
import axios from 'axios';

// ✅ Global Styles (fonts, colors, AND the toggle animation)
const GlobalStyles = () => (
  <style type="text/css">{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    body, .auth-page {
      font-family: 'Inter', sans-serif;
      background-color: #f8f9fa;
    }

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
    }

    .text-brand {
      color: #6c56d0 !important;
      font-weight: 500;
    }

    .form-control:focus {
      border-color: #6c56d0;
      box-shadow: 0 0 0 3px rgba(108, 86, 208, 0.2);
    }

    /* * ⭐️ HERE IS THE SLIDING TOGGLE ANIMATION ⭐️
       */
    .auth-toggle-group {
      position: relative;
      display: flex;
      width: 100%;
      background-color: #e9ecef;
      border-radius: 999px;
      padding: 0.25rem;
      margin-bottom: 1.5rem;
    }

    .toggle-slider {
      position: absolute;
      top: 0.25rem;
      bottom: 0.25rem;
      left: 0.25rem;
      width: calc(50% - 0.25rem);
      background-color: #fff;
      border-radius: 999px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      transform: translateX(0%);
    }
    /* This class moves the slider */
    .auth-toggle-group.signup-active .toggle-slider {
      transform: translateX(100%);
    }

    .auth-toggle-btn {
      width: 50%;
      border-radius: 999px;
      font-weight: 500;
      background: transparent;
      color: #6c757d;
      z-index: 2;
      border: none;
      padding: 0.5rem 0;
    }
    .auth-toggle-btn.active {
      color: #000;
    }
  `}</style>
);

// ✅ Login Form (Now logs in OWNER)
const LoginForm = ({ setIsLoginView }) => {
  // --- State for inputs and errors ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth(); // Get login from context
  const navigate = useNavigate(); // Get navigate from hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/owner/login', {
        email,
        password,
      });

      // ✅ The backend sends back the token AND the user data
      const { token, ...userData } = response.data;
      
      // ✅ Pass BOTH the user object and the token to the context
      login(userData, token); 
      
      navigate('/dashboard'); 

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="fw-semibold mb-2">Owner Log In</h3>
      <p className="text-muted mb-4">
        Welcome back! Please enter your details.
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label className="fw-medium">Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label className="fw-medium">Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="•••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <Form.Check 
            type="checkbox" 
            label="Remember for 30 days"
            id="remember-me" 
            disabled={isLoading}
          />
          <a href="#" className="small text-decoration-none text-brand">
            Forgot password
          </a>
        </div>

        {/* Show error message */}
        {error && (
          <Alert variant="danger" className="text-center p-2 small">
            {error}
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-100 btn-brand"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Form>

      <p className="text-center small text-muted mt-4 mb-0">
        Don’t have an account?{" "}
        <Button
          variant="link"
          className="p-0 small text-brand"
          onClick={() => setIsLoginView(false)}
          disabled={isLoading}
        >
          Sign up
        </Button>
      </p>
    </>
  );
};

// ✅ Register Form (Now registers OWNER)
const RegisterForm = ({ setIsLoginView }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  // ⭐️ FIX: Added fields for Owner model
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // ⭐️ FIX: Corrected URL to register as OWNER
      const response = await axios.post('/api/auth/owner/register', {
        name: fullName, 
        email,
        password,
        phone,
        shopName,    // ⭐️ FIX: Added field
        shopAddress, // ⭐️ FIX: Added field
      });
      
      alert("Account created successfully! Please wait for admin approval, then log in.");
      setIsLoading(false);
      setIsLoginView(true); // Switch to login view

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="fw-semibold mb-2">Register your Business</h3>
      <p className="text-muted mb-4">Fill out your shop details to get started.</p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="fullName">
          <Form.Label className="fw-medium">Your Full Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="e.g., Rohan Sharma" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
            required 
          />
        </Form.Group>
        
        {/* ⭐️ FIX: Added Shop Name field */}
        <Form.Group className="mb-3" controlId="shopName">
          <Form.Label className="fw-medium">Shop Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="e.g., Rohan's Fresh Mart" 
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            disabled={isLoading}
            required 
          />
        </Form.Group>
        
        {/* ⭐️ FIX: Added Shop Address field */}
        <Form.Group className="mb-3" controlId="shopAddress">
          <Form.Label className="fw-medium">Shop Address</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="123, Main Road, Hyderabad" 
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            disabled={isLoading}
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-email">
          <Form.Label className="fw-medium">Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="your-email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-password">
          <Form.Label className="fw-medium">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phone">
          <Form.Label className="fw-medium">Phone Number</Form.Label>
          <Form.Control 
            type="tel" 
            placeholder="e.g., 9876543210" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            required 
          />
        </Form.Group>
        
        {/* Show error message */}
        {error && (
          <Alert variant="danger" className="text-center p-2 small">
            {error}
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-100 mt-2 btn-brand"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Register for Approval'}
        </Button>
      </Form>

      <p className="text-center small text-muted mt-4 mb-0">
        Already have an account?{" "}
        <Button
          variant="link"
          className="p-0 small text-brand"
          onClick={() => setIsLoginView(true)}
          disabled={isLoading}
        >
          Log in
        </Button>
      </p>
    </>
  );
};

// ✅ Main Component (Ties it all together)
const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-start py-5 auth-page">
      <GlobalStyles />
      <Card
        className="w-100 border-0 shadow-sm"
        style={{ maxWidth: "450px", borderRadius: "0.75rem" }}
      >
        <Card.Body className="p-4 p-sm-5">
          <div className="d-flex justify-content-center mb-4">
            <Image
              src="/orderly.jpg"
              alt="App Logo"
              onError={(e) => { e.target.src = 'https://placehold.co/64x64/6c56d0/fff?text=Logo' }}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>

          <div
            className={`auth-toggle-group ${
              !isLoginView ? "signup-active" : ""
            }`}
          >
            <div className="toggle-slider"></div>
            <Button
              className={`auth-toggle-btn ${isLoginView ? "active" : ""}`}
              onClick={() => setIsLoginView(true)}
              variant="link"
            >
              Log in
            </Button>
            <Button
              className={`auth-toggle-btn ${!isLoginView ? "active" : ""}`}
              onClick={() => setIsLoginView(false)}
              variant="link"
            >
              Sign up
            </Button>
          </div>

          <div className="mt-4">
            {isLoginView ? (
              <LoginForm setIsLoginView={setIsLoginView} />
            ) : (
              <RegisterForm setIsLoginView={setIsLoginView} />
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuthPage;