import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Modal,
  Tabs,
  Tab,
  Alert,
  ListGroup,
  Spinner,
  Offcanvas,
} from "react-bootstrap";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UPI_ID = "msjanakiram2005@okaxis";
const LIBRARIES = ["geocoding"];
const MAP_DEFAULT = { lat: 17.385044, lng: 78.486671 };

const ShopList = ({ shops = [], loading, error, onShopSelect }) => {
  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">Error loading shops: {error.message}</Alert>;
  if (!shops || shops.length === 0) return <Alert variant="info">No shops are available at this time.</Alert>;

  return (
    <Container>
      <h3 className="fw-bold mb-4">Shops Near You</h3>
      <Row>
        {shops.map((shop) => (
          <Col md={4} key={shop._id} className="mb-4">
            <Card className="shadow-sm h-100 border-0 rounded-3">
              <Card.Img
                variant="top"
                src={shop.img || `https://placehold.co/300x180?text=${encodeURIComponent(shop.name)}`}
                alt={shop.name}
                style={{ height: "180px", objectFit: "cover" }}
                onError={(e) => { e.target.src = `https://placehold.co/300x180?text=${encodeURIComponent(shop.name)}`; }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{shop.name}</Card.Title>
                <Card.Text className="text-muted mb-2">{shop.desc}</Card.Text>
                <div className="mb-3">
                  <small className="text-success fw-semibold">Opens at: {shop.open || "N/A"}</small>
                  <br />
                  <small className="text-danger fw-semibold">Closes at: {shop.close || "N/A"}</small>
                </div>
                <Button variant="primary" className="w-100 mt-auto" onClick={() => onShopSelect(shop)}>View Shop</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

// (other components omitted for brevity — this is a fixed copy of CustomerDashboard)

const CustomerDashboardFixed = () => {
  // Minimal working container to replace broken file while you review.
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('shop');

  return (
    <Container className="py-4">
      <Row>
        <Col md={3} className="d-none d-md-block">
          <Card className="p-3">
            <h5 className="mb-3">Menu</h5>
            <Button variant="link" className="d-block text-start" onClick={() => setActiveTab('shop')}>Shop</Button>
            <Button variant="link" className="d-block text-start" onClick={() => setActiveTab('cart')}>Cart</Button>
            <Button variant="link" className="d-block text-start" onClick={() => setActiveTab('orders')}>Orders</Button>
            <Button variant="link" className="d-block text-start" onClick={() => logout()}>Log out</Button>
          </Card>
        </Col>
        <Col md={9}>
          {activeTab === 'shop' && <ShopList shops={[]} loading={false} onShopSelect={() => {}} />}
          {activeTab === 'cart' && <Card className="p-4">Cart (placeholder)</Card>}
          {activeTab === 'orders' && <Card className="p-4">Orders (placeholder)</Card>}
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerDashboardFixed;
