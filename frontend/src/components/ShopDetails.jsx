import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { useCart } from "../context/CartContext";

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Dummy data (Replace with API data later)
  const shops = [
    {
      id: 1,
      name: "Fresh Mart",
      desc: "Groceries and vegetables",
      img: "/shop1.jpg",
      items: [
        { id: "1a", name: "Tomatoes 1kg", price: 40 },
        { id: "1b", name: "Onions 1kg", price: 50 },
        { id: "1c", name: "Potatoes 1kg", price: 35 },
      ],
    },
    {
      id: 2,
      name: "Spice Hub",
      desc: "All Indian spices and masalas",
      img: "/shop2.jpg",
      items: [
        { id: "2a", name: "Turmeric Powder 100g", price: 30 },
        { id: "2b", name: "Red Chili 100g", price: 40 },
      ],
    },
    {
      id: 3,
      name: "Daily Bakes",
      desc: "Fresh breads and cakes",
      img: "/shop3.jpg",
      items: [
        { id: "3a", name: "Chocolate Cake", price: 250 },
        { id: "3b", name: "Garlic Bread", price: 80 },
      ],
    },
  ];

  const shop = shops.find((s) => s.id === Number(id));

  // Handle open modal
  const handleAddClick = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowModal(true);
  };

  // Confirm add to cart
  const handleConfirmAdd = () => {
    const totalPrice = selectedItem.price * quantity;
    addToCart({ ...selectedItem, qty: quantity, total: totalPrice });
    setShowModal(false);
  };

  if (!shop)
    return (
      <Container className="text-center mt-5">
        <h3>Shop not found</h3>
        <Button className="mt-3" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );

  return (
    <Container className="py-5">
      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Back to Shops
      </Button>

      <div className="text-center mb-4">
        <img
          src={shop.img}
          alt={shop.name}
          style={{ width: "200px", height: "200px", borderRadius: "10px" }}
          onError={(e) => {
            e.target.src = "https://placehold.co/200x200?text=Shop+Image";
          }}
        />
        <h2 className="mt-3 fw-bold">{shop.name}</h2>
        <p className="text-muted">{shop.desc}</p>
      </div>

      <Row>
        {shop.items.map((item) => (
          <Col md={4} key={item.id} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <h5>{item.name}</h5>
                  <p className="text-muted">₹{item.price}</p>
                </div>
                <Button variant="primary" onClick={() => handleAddClick(item)}>
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quantity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <h5>{selectedItem.name}</h5>
              <p className="text-muted">Price per item: ₹{selectedItem.price}</p>
              <Form.Group className="mb-3">
                <Form.Label>Enter Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </Form.Group>
              <p className="fw-semibold">
                Total Price: ₹{selectedItem.price * quantity}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmAdd}>
            Confirm Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ShopDetails;
