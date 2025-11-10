import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/**
 * This is a protected dashboard page.
 * It uses the useAuth() hook to get the logout function and user data.
 */
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // After logging out, redirect the user to the auth page
    navigate('/auth');
  };

  // The 'user' object is populated from the JWT payload
  // in AuthContext.jsx
  const userName = user?.name || 'Valued User';
  const userEmail = user?.email || 'No email found';
  const shopName = user?.shopName || 'Your Shop';

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: '0.75rem' }}
            >
              <Card.Body className="p-4 p-sm-5 text-center">
                <Card.Title as="h2" className="fw-semibold mb-3">
                  Welcome, {userName}!
                </Card.Title>
                <Card.Text className="text-muted mb-4">
                  You are logged in to the dashboard for{' '}
                  <strong>{shopName}</strong>.
                </Card.Text>
                <p className="small">
                  <strong>Email:</strong> {userEmail}
                </p>

                {/* You can display the raw user data for debugging */}
                {/* <pre className="text-start p-3 bg-light border rounded small">
                  {JSON.stringify(user, null, 2)}
                </pre> */}

                <Button
                  variant="brand"
                  className="w-100 mt-4 btn-brand"
                  onClick={handleLogout}
                >
                  Sign out
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardPage;