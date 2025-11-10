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
  InputGroup, // Added for cart
} from "react-bootstrap";
// ⭐️ 1. MODIFIED: Use hook instead of <LoadScript>
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UPI_ID = 'msjanakiram2005@okaxis';
const LIBRARIES = ["geocoding"];
const MAP_DEFAULT = { lat: 17.385044, lng: 78.486671 };
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// --- Sub-components (Views) ---

// 1. Shop list
const ShopList = ({ shops, loading, error, onShopSelect }) => {
  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">Error loading shops: {error.message}</Alert>;
  if (!shops || shops.length === 0) return <Alert variant="info">No shops are available at this time.</Alert>;

  return (
    <Container>
      <h3 className="fw-bold mb-4">Shops Near You</h3>
      <Row>
        {shops.map((shop) => (
          <Col md={6} lg={4} key={shop._id} className="mb-4">
            <Card className="shadow-sm h-100 border-0 rounded-3 shop-card">
              <Card.Img 
                variant="top" 
                src={shop.img || `https://placehold.co/400x250?text=${encodeURIComponent(shop.name)}`} 
                alt={shop.name} 
                style={{ height: "200px", objectFit: "cover" }} 
                onError={(e) => { e.target.src = `https://placehold.co/400x250?text=${encodeURIComponent(shop.name)}`; }} 
              />
              <Card.Body className="d-flex flex-column p-3">
                <Card.Title className="fw-bold mb-1">{shop.name}</Card.Title>
                {/* ⭐️ 2. MODIFIED: Added text-truncate for long descriptions */}
                <Card.Text className="text-muted mb-2 text-truncate" style={{ minHeight: '1.5rem' }}>
                  {shop.desc || 'No description available.'}
                </Card.Text>
                {/* ⭐️ 2. MODIFIED: Improved styling for timings */}
                <div className="mb-3 p-2 bg-light rounded-2 border" style={{ fontSize: '0.9rem' }}>
                  <div>
                    <i className="bi bi-clock-fill text-success me-2"></i>
                    <span className="fw-semibold">Opens at:</span> {shop.open || 'N/A'}
                  </div>
                  <div>
                    <i className="bi bi-clock-history text-danger me-2"></i>
                    <span className="fw-semibold">Closes at:</span> {shop.close || 'N/A'}
                  </div>
                </div>
                <Button variant="primary" className="w-100 mt-auto" onClick={() => onShopSelect(shop)}>
                  <i className="bi bi-eye-fill me-2"></i>View Shop
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

// 2. Shop detail
const ShopDetail = ({ shop, onBack, onAddToCart }) => (
  <Container>
    <Button variant="link" onClick={onBack} className="p-0 mb-2"><i className="bi bi-arrow-left me-2"></i>Back to Shops</Button>
    <Row>
      <Col md={4}>
        <img 
          src={shop.img || `https://placehold.co/400x300?text=${encodeURIComponent(shop.name)}`} 
          alt={shop.name} 
          className="img-fluid rounded-3 shadow-sm mb-3" 
          onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Shop+Image"; }} 
        />
        <h3 className="fw-bold">{shop.name}</h3>
        <p className="text-muted">{shop.desc}</p>
        <p><span className="text-success fw-semibold">Open: {shop.open || 'N/A'}</span> - <span className="text-danger fw-semibold">Close: {shop.close || 'N/A'}</span></p>
      </Col>
      <Col md={8}>
        <h4 className="fw-bold mb-3">Menu</h4>
        <ListGroup variant="flush">
          {shop.menu && shop.menu.length > 0 ? (
            shop.menu.map((item) => (
              // ⭐️ 3. MODIFIED: Restyled menu items
              <ListGroup.Item key={item._id} className="px-1 py-3">
                <Row className="align-items-center">
                  <Col>
                    <h6 className="mb-0 fw-semibold">{item.name}</h6>
                    <small className="text-muted">
                      ₹{item.price.toFixed(2)} / {item.unit || 'item'}
                    </small>
                  </Col>
                  <Col xs="auto">
                    <Button variant="outline-primary" size="sm" onClick={() => onAddToCart(item, shop._id)}>
                      <i className="bi bi-plus-lg me-1"></i> Add
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))
          ) : (
            <Alert variant="info">This shop has not added any menu items yet.</Alert>
          )}
        </ListGroup>
      </Col>
    </Row>
  </Container>
);

// 3. Cart view
// ⭐️ 4 & 5. MODIFIED: Added coupon props
const CartView = ({ 
  cart, loading, offers, selectedOffer, onOfferChange,
  increaseQty, decreaseQty, deleteItem, onCheckout 
}) => {
  const cartTotal = cart?.totalPrice || 0;
  // ⭐️ 5. MODIFIED: Use selectedOffer for discount
  const discount = selectedOffer ? selectedOffer.discount : 0;
  const discountTitle = selectedOffer ? selectedOffer.title : "No Offer";
  const discountDesc = selectedOffer ? selectedOffer.desc : "No coupon selected.";
  
  const discountAmount = cartTotal * (discount / 100);
  const discountedTotal = cartTotal - discountAmount;

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

  return (
    <Container>
      <h3 className="fw-bold mb-4">Your Cart</h3>
      {!cart || !cart.items || cart.items.length === 0 ? (
        <Alert variant="info"><i className="bi bi-cart-x-fill me-2"></i>Your cart is empty.</Alert>
      ) : (
        cart.items.map((item) => (
          <Card key={item._id} className="mb-3 shadow-sm border-0">
            <Card.Body>
              {/* ⭐️ 4. MODIFIED: Restyled cart item */}
              <Row className="align-items-center">
                <Col>
                  <h6 className="fw-semibold mb-1">{item.menuItem.name}</h6>
                  <p className="text-muted mb-1 small">
                    ₹{item.price.toFixed(2)} × {item.quantity}
                  </p>
                  <p className="fw-bold text-success mb-0">
                    Total: ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </Col>
                <Col xs="auto" className="d-flex align-items-center gap-2">
                  <Button variant="link" size="sm" onClick={() => decreaseQty(item)} className="p-1 rounded-circle" style={{ width: '30px', height: '30px' }}>
                    <i className="bi bi-dash-lg text-danger fs-5"></i>
                  </Button>
                  <span className="fw-bold fs-5" style={{ minWidth: "25px", textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <Button variant="link" size="sm" onClick={() => increaseQty(item)} className="p-1 rounded-circle" style={{ width: '30px', height: '30px' }}>
                    <i className="bi bi-plus-lg text-success fs-5"></i>
                  </Button>
                  <Button variant="link" size="sm" onClick={() => deleteItem(item._id)} className="ms-3 p-1 rounded-circle" style={{ width: '30px', height: '30px' }}>
                    <i className="bi bi-trash-fill text-danger fs-5"></i>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}

      {cart && cart.items && cart.items.length > 0 && (
        <>
          {/* ⭐️ 5. MODIFIED: Added Coupon Selector */}
          <Card className="mt-4 shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3"><i className="bi bi-ticket-detailed-fill text-primary me-2"></i>Apply Coupon</h5>
              <Form.Group>
                <Form.Label>Select an available offer:</Form.Label>
                <Form.Select 
                  value={selectedOffer ? selectedOffer.title : ""} 
                  onChange={onOfferChange}
                  disabled={!offers || offers.length === 0}
                >
                  <option value="">No Offer</option>
                  {offers.map((o, index) => (
                    <option key={index} value={o.title}>
                      {o.title} - {o.desc} ({o.discount}%)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="mt-4 shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold text-primary">{discountTitle} Applied!</h5>
              <p className="text-muted">{discountDesc}</p>
              <hr />
              <div className="d-flex justify-content-between"><span>Subtotal:</span><span>₹{cartTotal.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between text-success"><span>Discount ({discount}%):</span><span>- ₹{discountAmount.toFixed(2)}</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5"><span>Grand Total:</span><span>₹{discountedTotal.toFixed(2)}</span></div>
            </Card.Body>
          </Card>
          <Button variant="success" className="w-100 mt-3 py-2 fs-5" onClick={() => onCheckout(discountedTotal)}>
            <i className="bi bi-shield-check-fill me-2"></i>Proceed to Payment
          </Button>
        </>
      )}
    </Container>
  );
};

// 4. Orders View
// ⭐️ 7. MODIFIED: Improved OrdersView CSS
const OrdersView = ({ orders, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error loading orders: {error.message}</Alert>;
  }
  
  const presentOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "accepted" || o.status === "ongoing"
  );
  const pastOrders = orders.filter((o) => o.status === "delivered" || o.status === "rejected");

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending": return { bg: "secondary", icon: "bi-hourglass-split" };
      case "accepted": return { bg: "primary", icon: "bi-check-lg" };
      case "ongoing": return { bg: "warning", icon: "bi-truck" };
      case "delivered": return { bg: "success", icon: "bi-check-all" };
      case "rejected": return { bg: "danger", icon: "bi-x-circle" };
      default: return { bg: "light", icon: "bi-question-circle" };
    }
  };

  const renderOrderCard = (order) => {
    const statusInfo = getStatusInfo(order.status);
    return (
      <Card key={order._id} className="mb-3 shadow-sm border-0">
        <Card.Header className={`fw-bold d-flex justify-content-between align-items-center bg-${statusInfo.bg} text-white`}>
          <span>Order #{order._id.slice(-6)}</span>
          <span className="badge bg-light text-dark d-flex align-items-center">
            <i className={`bi ${statusInfo.icon} me-1`}></i>
            {order.status}
          </span>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-1 small">Placed: {new Date(order.orderDate).toLocaleString()}</p>
          <p className="mb-2 small">Address: {order.deliveryAddress}</p>
          {order.items && (
            <ul className="small">
              {order.items.map((item) => (
                <li key={item.menuItem}>
                  {item.name} (₹{item.price.toFixed(2)} × {item.quantity})
                </li>
              ))}
            </ul>
          )}
          <hr />
          <h6 className="fw-bold text-end mb-0">Total: ₹{order.totalPrice.toFixed(2)}</h6>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container>
      <h3 className="fw-bold mb-4">Your Orders</h3>
      <Tabs defaultActiveKey="present" id="order-tabs" className="mb-3" fill>
        <Tab eventKey="present" title={`Present (${presentOrders.length})`}>
          {presentOrders.length === 0 ? (
            <Alert variant="info">No active orders.</Alert>
          ) : (
            presentOrders.map(renderOrderCard)
          )}
        </Tab>
        <Tab eventKey="past" title={`Past (${pastOrders.length})`}>
          {pastOrders.length === 0 ? (
            <Alert variant="info">No past orders found.</Alert>
          ) : (
            pastOrders.map(renderOrderCard)
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

// 5. Complaints View
// ⭐️ 8. MODIFIED: Improved ComplaintsView CSS
const ComplaintsView = ({
  complaints, shops, loading,
  onSubmit, onDelete, onClearAll
}) => {
  const [complaintShop, setComplaintShop] = useState("");
  const [complaintType, setComplaintType] = useState("shop");
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintText, setComplaintText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      subject: complaintSubject,
      message: complaintText,
      shopId: complaintType === 'shop' ? complaintShop : null,
      type: complaintType
    };
    onSubmit(data);
    setComplaintSubject("");
    setComplaintText("");
    setComplaintShop("");
  };

  const getStatusIcon = (status) => {
    return status === 'resolved' 
      ? <i className="bi bi-check-circle-fill text-success me-2"></i> 
      : <i className="bi bi-hourglass-split text-warning me-2"></i>;
  };

  return (
    <Container>
      <h3 className="fw-bold mb-4">Complaints</h3>
      <Tabs defaultActiveKey="new" id="complaint-tabs" className="mb-3" fill>
        <Tab eventKey="new" title="Submit New">
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Floating className="mb-3">
                  <Form.Select id="complaintType" value={complaintType} onChange={(e) => setComplaintType(e.target.value)}>
                    <option value="shop">Shop Complaint</option>
                    <option value="admin">Admin / App Complaint</option>
                  </Form.Select>
                  <label htmlFor="complaintType">Complaint Type</label>
                </Form.Floating>

                {complaintType === 'shop' && (
                  <Form.Floating className="mb-3">
                    <Form.Select id="complaintShop" value={complaintShop} onChange={(e) => setComplaintShop(e.target.value)}>
                      <option value="">Select a shop...</option>
                      {shops.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </Form.Select>
                    <label htmlFor="complaintShop">Shop Name</label>
                  </Form.Floating>
                )}
                
                <Form.Floating className="mb-3">
                  <Form.Control id="complaintSubject" type="text" placeholder="e.g., Late Delivery" value={complaintSubject} onChange={(e) => setComplaintSubject(e.target.value)} required />
                  <label htmlFor="complaintSubject">Subject</label>
                </Form.Floating>
                
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="complaintText"
                    as="textarea"
                    rows={5}
                    placeholder="Please describe the issue..."
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    required
                    style={{ height: '150px' }}
                  />
                  <label htmlFor="complaintText">Your Complaint</label>
                </Form.Floating>
                <Button variant="primary" type="submit" className="w-100 py-2">
                  <i className="bi bi-send-fill me-2"></i>Submit Complaint
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="history" title={`History (${complaints.length})`}>
          <Card className="shadow-sm border-0">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Your Past Complaints</h5>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={onClearAll}
                disabled={complaints.length === 0}
              >
                <i className="bi bi-trash-fill me-1"></i> Clear All
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center p-3"><Spinner animation="border" size="sm" /></div>
              ) : complaints.length === 0 ? (
                <Alert variant="info">You have no complaint history.</Alert>
              ) : (
                <ListGroup variant="flush">
                  {complaints.map(complaint => (
                    <ListGroup.Item key={complaint._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{getStatusIcon(complaint.status)} {complaint.subject}</div>
                        <small className="text-muted ms-4">{new Date(complaint.date).toLocaleDateString()} - 
                          <span className={`fw-semibold text-capitalize ${complaint.status === 'resolved' ? 'text-success' : 'text-warning'}`}>
                            {complaint.status}
                          </span>
                        </small>
                      </div>
                      <Button variant="link" className="text-danger p-1" onClick={() => onDelete(complaint._id)}>
                        <i className="bi bi-trash-fill fs-5"></i>
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

// 6. Notifications View
const NotificationsView = ({ notifications, loading, error, onDelete, onClearAll }) => {
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Notifications</h3>
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={onClearAll}
          disabled={notifications.length === 0}
        >
          <i className="bi bi-trash-fill me-1"></i> Clear All
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger">{error.message}</Alert>
      ) : notifications.length === 0 ? (
        <Alert variant="info">You have no new notifications.</Alert>
      ) : (
        <ListGroup>
          {notifications.map(note => (
            <ListGroup.Item key={note._id} className="d-flex justify-content-between align-items-start">
              <div>
                <div className={`fw-bold text-primary`}><i className="bi bi-bell-fill me-2"></i>{note.type || 'Notification'}</div>
                {note.message}
                 <br />
                <small className="text-muted">{new Date(note.date).toLocaleString()}</small>
              </div>
              <Button variant="link" className="text-danger p-0" size="sm" onClick={() => onDelete(note._id)}>
                <i className="bi bi-x-lg fs-5"></i>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

// 7. Profile View
const ProfileView = ({
  profile, loading, error, isEditing, setIsEditing,
  passwordData, onProfileChange, onPasswordChange,
  onProfileSubmit, onPasswordSubmit
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error loading profile: {error.message}</Alert>;
  }

  if (!profile) {
    return <Alert variant="warning">Could not load profile data.</Alert>;
  }

  return (
    <Container>
      <h3 className="fw-bold mb-4">My Profile</h3>
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <img
                  src={`https://placehold.co/100x100/0d6efd/white?text=${profile.name ? profile.name.charAt(0) : (profile.email ? profile.email.charAt(0) : 'U')}`}
                  alt="Profile Avatar"
                  className="rounded-circle border border-3 border-primary"
                />
              </div>

              <h5 className="fw-bold mb-3">Your Details</h5>
              <Form onSubmit={onProfileSubmit}>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="profileName" type="text" name="name"
                    value={profile.name || ''} onChange={onProfileChange}
                    readOnly={!isEditing} placeholder="Full Name"
                    plaintext={!isEditing} className={!isEditing ? "bg-light" : ""}
                  />
                  <label htmlFor="profileName">Full Name</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="profileEmail" type="email" name="email"
                    value={profile.email || ''} onChange={onProfileChange}
                    readOnly={!isEditing} placeholder="Email Address"
                    plaintext={!isEditing} className={!isEditing ? "bg-light" : ""}
                  />
                  <label htmlFor="profileEmail">Email Address</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="profilePhone" type="tel" name="phone"
                    value={profile.phone || ''} onChange={onProfileChange}
                    readOnly={!isEditing} placeholder="Phone Number"
                    plaintext={!isEditing} className={!isEditing ? "bg-light" : ""}
                  />
                  <label htmlFor="profilePhone">Phone Number</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="profileAddress" type="text" name="address"
                    value={profile.address || ''} onChange={onProfileChange}
                    readOnly={!isEditing} placeholder="Delivery Address"
                    plaintext={!isEditing} className={!isEditing ? "bg-light" : ""}
                  />
                  <label htmlFor="profileAddress">Delivery Address</label>
                </Form.Floating>

                {isEditing ? (
                  <Button variant="success" type="submit" className="w-100 py-2">
                    <i className="bi bi-check-lg me-2"></i>Save Changes
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => setIsEditing(true)} className="w-100 py-2">
                    <i className="bi bi-pencil-fill me-2"></i>Edit Profile
                  </Button>
                )}
              </Form>

              <hr className="my-4" />

              <h5 className="fw-bold mb-3">Change Password</h5>
              <Form onSubmit={onPasswordSubmit}>
                 <Form.Floating className="mb-3">
                  <Form.Control
                    id="passCurrent" type="password" name="current"
                    value={passwordData.current} onChange={onPasswordChange}
                    placeholder="Current Password" required
                  />
                  <label htmlFor="passCurrent">Current Password</label>
                </Form.Floating>
                 <Form.Floating className="mb-3">
                  <Form.Control
                    id="passNew" type="password" name="new"
                    value={passwordData.new} onChange={onPasswordChange}
                    placeholder="New Password" required
                  />
                  <label htmlFor="passNew">New Password</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="passConfirm" type="password" name="confirm"
                    value={passwordData.confirm} onChange={onPasswordChange}
                    placeholder="Confirm New Password" required
                  />
                  <label htmlFor="passConfirm">Confirm New Password</label>
                </Form.Floating>
                <Button variant="primary" type="submit" className="w-100 py-2">
                  <i className="bi bi-key-fill me-2"></i>Change Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};


// --- Reusable Sidebar Navigation Component ---
// ⭐️ 12. MODIFIED: Removed onLogout and container styles
const SidebarNav = ({ activeTab, onSelectTab, onLinkClick }) => {

  const navLinkStyle = (tabId) => ({
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    color: activeTab === tabId ? "#fff" : "#adb5bd",
    backgroundColor: activeTab === tabId ? "#0d6efd" : "transparent",
    fontWeight: 500
  });

  const handleNavClick = (tabId) => {
    onSelectTab(tabId); // Set active tab
    if (onLinkClick) {
      onLinkClick(); // Close offcanvas on mobile
    }
  };

  return (
    <ul className="nav flex-column">
      {[
        { id: "shop", label: "Shop", icon: "bi-shop" },
        { id: "cart", label: "Cart", icon: "bi-cart" },
        { id: "orders", label: "Orders", icon: "bi-box-seam" },
        { id: "complaints", label: "Complaints", icon: "bi-chat-left-text" },
        { id: "notifications", label: "Notifications", icon: "bi-bell" },
        { id: "profile", label: "Profile", icon: "bi-person" },
      ].map((tab) => (
        <li key={tab.id} className="nav-item mb-2">
          <Button
            variant="link"
            className="w-100"
            onClick={() => handleNavClick(tab.id)}
            style={navLinkStyle(tab.id)}
          >
            <i className={`bi ${tab.icon} fs-5`}></i>
            <span className="fw-medium">{tab.label}</span>
          </Button>
        </li>
      ))}
    </ul>
  );
};


// --- ⭐️ Main Customer Dashboard Component (Container) ⭐️ ---
const CustomerDashboard = () => {
  // --- Auth & Navigation ---
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // ⭐️ 1. MAP FIX: Load API using the hook
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // --- Navigation State ---
  // ⭐️ 11. MODIFIED: Load activeTab from localStorage
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'shop');
  const [view, setView] = useState("dashboard");  
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedShopLoading, setSelectedShopLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  // --- Modal State ---
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // --- Map State ---
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [address, setAddress] = useState("");
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  
  // --- Cart State ---
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderTotal, setOrderTotal] = useState(0); // To pass total to payment modal
  
  // --- API Data State ---
  const [shops, setShops] =useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shopsError, setShopsError] = useState(null);

  const [offers, setOffers] = useState([]);
  // ⭐️ 5. MODIFIED: Add state for selected offer
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState(null);
  
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [complaintsError, setComplaintsError] = useState(null);
  
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });


  // --- ⭐️ API Fetching Functions ⭐️ ---

  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const response = await axios.get('/api/customer/cart');
      setCart(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  };

  const fetchShops = async () => {
    setShopsLoading(true);
    try {
      const response = await axios.get('/api/customer/shops');
      setShops(response.data);  
    } catch (err) {
      setShopsError(err);
      console.error("Error fetching shops:", err);
    } finally {
      setShopsLoading(false);
    }
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await axios.get('/api/customer/profile');
      setProfile(response.data);
    } catch (err) {
      setProfileError(err);
      console.error("Error fetching profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };
  
  const fetchOffers = async () => {
    try {
      // const response = await axios.get('/api/customer/offers');
      // setOffers(response.data);
      const mockOffers = [
        { title: "Welcome Offer", desc: "10% off", discount: 10 },
        { title: "Summer Sale", desc: "5% off", discount: 5 },
        { title: "Festive Deal", desc: "15% off", discount: 15 }
      ];
      setOffers(mockOffers);

      // ⭐️ 5. MODIFIED: Auto-select best offer
      if (mockOffers.length > 0) {
        const bestOffer = mockOffers.reduce((max, o) => o.discount > max.discount ? o : max, mockOffers[0]);
        setSelectedOffer(bestOffer);
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const presentRes = await axios.get('/api/customer/orders/present');
      const pastRes = await axios.get('/api/customer/orders/previous');
      setOrders([...presentRes.data, ...pastRes.data].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (err) {
      setOrdersError(err);
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };
  
  const fetchComplaints = async () => {
    setComplaintsLoading(true);
    try {
      const response = await axios.get('/api/customer/complaints/my');
      setComplaints(response.data);
    } catch (err) {
      setComplaintsError(err);
      console.error("Error fetching complaints:", err);
    } finally {
      setComplaintsLoading(false);
    }
  };
  
  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const response = await axios.get('/api/customer/notifications');
      setNotifications(response.data);
    } catch (err) {
      setNotificationsError(err);
      console.error("Error fetching notifications:", err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // --- ⭐️ Data Fetching Effects ⭐️ ---

  useEffect(() => {
    fetchShops();
    fetchProfile();
    fetchOffers();  
    fetchCart();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "complaints") {
      fetchComplaints();
    } else if (activeTab === "notifications") {
      fetchNotifications();
    } else if (activeTab === "cart") {
      fetchCart();
    }
  }, [activeTab]);

  // ⭐️ 11. MODIFIED: Save activeTab to localStorage
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);


  // --- ⭐️ Cart Handlers ⭐️ ---
  
  const handleAddToCart = async (product, productShopId) => {
    const existingCart = cart;
    const currentShopId = existingCart?.shop;

    if (currentShopId && currentShopId.toString() !== productShopId) {
      if (!window.confirm("You have items from another shop. Do you want to clear your cart and add this item?")) {
        return;
      }
    }
    
    const exist = existingCart?.items.find((x) => x.menuItem._id === product._id);
    const newQuantity = exist ? exist.quantity + 1 : 1;

    try {
      await axios.post('/api/customer/cart', {
        menuItemId: product._id,
        quantity: newQuantity,
        shopId: productShopId,
      });
      await fetchCart();
      alert(`${product.name} added to cart!`);
    } catch (err) {
      alert(`Failed to add to cart: ${err.response?.data?.message || err.message}`);
      console.error(err);
    }
  };

  const updateCartQuantity = async (cartItem, newQuantity) => {
    if (newQuantity <= 0) {
      await deleteItem(cartItem._id);
      return;
    }
    try {
      await axios.post('/api/customer/cart', {
        menuItemId: cartItem.menuItem._id,
        quantity: newQuantity,
        shopId: cart.shop,
      });
      await fetchCart();
    } catch (err) {
      alert(`Failed to update cart: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteItem = async (cartItemId) => {
    try {
      await axios.delete(`/api/customer/cart/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      alert(`Failed to delete item: ${err.response?.data?.message || err.message}`);
    }
  };

  const increaseQty = (cartItem) => {
    updateCartQuantity(cartItem, cartItem.quantity + 1);
  };
  
  const decreaseQty = (cartItem) => {
    updateCartQuantity(cartItem, cartItem.quantity - 1);
  };

  const clearCart = () => {
    setCart(null);
  };

  // ⭐️ 5. MODIFIED: Handler for coupon selection
  const handleOfferChange = (e) => {
    const selectedTitle = e.target.value;
    if (selectedTitle === "") {
      setSelectedOffer(null);
    } else {
      const newOffer = offers.find(o => o.title === selectedTitle);
      setSelectedOffer(newOffer);
    }
  };

  // --- ⭐️ Map Handlers ⭐️ ---
  const reverseGeocode = (lat, lng) => {
    setGeocodingLoading(true);
    setAddress("Fetching address...");
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            setAddress(results[0].formatted_address);
            setMapError(null);
          } else {
            setAddress("No address found at this location.");
          }
        } else {
          setAddress("Address lookup failed.");
          console.error("Geocoder failed due to: " + status);
        }
        setGeocodingLoading(false);
      });
    } catch (e) {
      console.error(e);
      setAddress("Error fetching address.");
      setGeocodingLoading(false);
    }
  };
  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    panToCurrentLocation(mapInstance);
  };
  const onMapClick = (e) => {
    const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setSelectedLocation(newPos);
    reverseGeocode(newPos.lat, newPos.lng);
  };
  const panToCurrentLocation = (mapToPan) => {
    const mapInstance = mapToPan || map;
    if (mapInstance && navigator.geolocation) {
      setMapError(null);
      setGeocodingLoading(true);
      setAddress("Finding your location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.panTo(pos);
          mapInstance.setZoom(15);
          setSelectedLocation(pos);
          reverseGeocode(pos.lat, pos.lng);
        },
        () => {
          setMapError("Geolocation permission denied. Please click on the map to set your location.");
          setGeocodingLoading(false);
          setAddress("Permission denied.");
        }
      );
    } else {
      setMapError("Geolocation is not supported by your browser.");
      setGeocodingLoading(false);
    }
  };

  // --- ⭐️ API + State Handlers ⭐️ ---
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setView("dashboard");
    setSelectedShop(null);
  };
  
  const handleShopSelect = async (shop) => {
    setSelectedShopLoading(true);
    setView("shop_detail");
    try {
      const response = await axios.get(`/api/customer/shops/${shop._id}`);
      const shopWithMenu = {
        ...response.data.shop,
        menu: response.data.menu
      };
      setSelectedShop(shopWithMenu);  
    } catch (err) {
      alert("Could not load shop details.");
      console.error(err);
      setView("dashboard");
    } finally {
      setSelectedShopLoading(false);
    }
  };

  const handleBackToShops = () => {
    setSelectedShop(null);
    setView("dashboard");
  };

  // ⭐️ 5. MODIFIED: Accept finalTotal
  const handleCheckout = (finalTotal) => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setOrderTotal(finalTotal); // Save final total for payment
    setShowLocationModal(true);  
  };
 
  // 🟢 Place Order
  const handleConfirmOrder = async () => {
    if (!address || address.trim() === "" || address.includes("Fetching") || address.includes("failed")) {
      alert("Please set a valid delivery address.");
      return;
    }
    
    const newOrder = {
      items: cart.items.map(item => ({
        menuItem: item.menuItem._id,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: orderTotal, // ⭐️ Use the calculated final total
      deliveryAddress: address,
      location: selectedLocation,
      paymentMethod,
      shop: cart.shop,
      offerApplied: selectedOffer ? selectedOffer.title : "No Offer"
    };

    // ⭐️ 6. MODIFIED: Added debug logs
    console.log("Submitting new order:", JSON.stringify(newOrder, null, 2));

    try {
      await axios.post('/api/customer/payment', newOrder);
      
      alert("✅ Order placed successfully!");
      
      clearCart();
      setShowPaymentModal(false);
      setSelectedLocation(null);
      setAddress("");  
      setActiveTab("orders");
      
    } catch (err) {
      // ⭐️ 6. MODIFIED: Enhanced error logging
      const errorMsg = err.response?.data?.message || err.message;
      alert(`❌ There was an error placing your order: ${errorMsg}`);
      console.error("Error placing order:", err.response ? err.response.data : err.message);
    }
  };

  // --- Profile Handlers ---
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/customer/profile', profile);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      alert('Failed to update profile: ' + errorMsg);
      console.error("Profile update error:", err.response ? err.response.data : err.message);
    }
  };
 
  // ⭐️ 10. MODIFIED: Un-mocked password submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match!");
      return;
    }
    try {
      await axios.put('/api/customer/profile/password', passwordData);
      alert('Password changed successfully!');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      alert('Failed to change password: ' + errorMsg);
      console.error("Password change error:", err.response ? err.response.data : err.message);
    }
  };

  // --- Notification Handlers ---
  // ⭐️ 9. MODIFIED: Un-mocked notification handlers
  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/api/customer/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      alert("Failed to delete notification.");
      console.error(err);
    }
  };
  
  const handleClearAllNotifications = async () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      try {
        await axios.delete('/api/customer/notifications/all');
        setNotifications([]);
      } catch (err) {
        alert("Failed to clear notifications.");
        console.error(err);
      }
    }
  };
  
  // --- Complaint Handlers ---
  const handleComplaintSubmit = async (complaintData) => {
    try {
      if (complaintData.type === 'admin') {
        await axios.post('/api/customer/complaints/admin', complaintData);
      } else {
        if (!complaintData.shopId) return alert("Please select a shop.");
        await axios.post(`/api/customer/complaints/restaurant/${complaintData.shopId}`, complaintData);
      }
      alert('Complaint submitted!');
      await fetchComplaints(); // Refetch
      setActiveTab('complaints'); // Switch to history tab
    } catch (err) {
      alert("Failed to submit complaint: " + err.response?.data?.message);
      console.error(err);
    }
  };

  // ⭐️ 8. MODIFIED: Un-mocked complaint handlers
  const handleDeleteComplaint = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await axios.delete(`/api/customer/complaints/my/${id}`);
        setComplaints(complaints.filter(c => c._id !== id));
      } catch (err) {
        alert("Failed to delete complaint.");
        console.error(err);
      }
    }
  };

  const handleClearAllComplaints = async () => {
    if (window.confirm("Are you sure you want to delete ALL complaint history?")) {
      try {
        await axios.delete('/api/customer/complaints/all');
        setComplaints([]);
      } catch (err) {
        alert("Failed to clear complaints.");
        console.error(err);
      }
    }
  };


  // --- ⭐️ Dynamic Content Rendering ⭐️ ---
  const renderMainContent = () => {
    if (view === "shop_detail") {
      if (selectedShopLoading) {
        return (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <h5 className="mt-3">Loading Shop...</h5>
          </div>
        );
      }
      if (selectedShop) {
        return (
          <ShopDetail
            shop={selectedShop}
            onBack={handleBackToShops}
            onAddToCart={handleAddToCart}
          />
        );
      }
    }

    switch (activeTab) {
      case "shop":
        return <ShopList  
          shops={shops}  
          loading={shopsLoading}  
          error={shopsError}  
          onShopSelect={handleShopSelect}  
        />;
      case "cart":
        return (
          <CartView
            cart={cart}
            loading={cartLoading}
            offers={offers} // ⭐️ 5. Pass offers
            selectedOffer={selectedOffer} // ⭐️ 5. Pass selectedOffer
            onOfferChange={handleOfferChange} // ⭐️ 5. Pass handler
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            deleteItem={deleteItem}
            onCheckout={handleCheckout}
          />
        );
      case "orders":
        return <OrdersView  
          orders={orders}  
          loading={ordersLoading}  
          error={ordersError}  
        />;
      case "complaints":
        return <ComplaintsView
          complaints={complaints}
          loading={complaintsLoading}
          error={complaintsError}
          shops={shops}
          onSubmit={handleComplaintSubmit}
          onDelete={handleDeleteComplaint}
          onClearAll={handleClearAllComplaints}
        />;
      case "notifications":
        return <NotificationsView
          notifications={notifications}
          loading={notificationsLoading}
          error={notificationsError}
          onDelete={handleDeleteNotification}
          onClearAll={handleClearAllNotifications}
        />;
      case "profile":
        return <ProfileView  
          profile={profile}
          loading={profileLoading}
          error={profileError}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          passwordData={passwordData}
          onProfileChange={handleProfileChange}
          onPasswordChange={handlePasswordChange}
          onProfileSubmit={handleProfileSubmit}
          onPasswordSubmit={handlePasswordSubmit}
        />;
      default:
        return <ShopList  
          shops={shops}  
          loading={shopsLoading}  
          error={shopsError}  
          onShopSelect={handleShopSelect}
        />;
    }
  };

  // --- STYLES ---
  const sidebarStyle = {
    width: collapsed ? "70px" : "250px",
    transition: "width 0.3s ease",
    // ⭐️ 12. MODIFIED: Let flexbox handle height
  };
 
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    marginBottom: '1rem',
  };

  // --- Payment Modal QR Data ---
  const upiData = `upi://pay?pa=${UPI_ID}&pn=OrderlyStore&am=${orderTotal.toFixed(2)}&cu=INR`;
  const encodedUpiDataQR = encodeURIComponent(upiData);

  // --- ⭐️ JSX ⭐️ ---
  return (
    <>
      {/* 1. Mobile-only Header */}
      <div className="d-lg-none bg-dark text-white p-2 d-flex justify-content-between align-items-center shadow-sm sticky-top">
        <div className="d-flex align-items-center">
          <img src="/orderly.jpg" alt="Orderly" style={{ height: '30px', width: '30px', borderRadius: '4px' }} />
          <h5 className="mb-0 ms-2 text-white">Orderly</h5>
        </div>
        <Button variant="outline-light" onClick={() => setShowOffcanvas(true)}>
           <i className="bi bi-list fs-4"></i>
        </Button>
      </div>

      <div className="d-flex" style={{ minHeight: '100vh' }}>
        
        {/* 2. Desktop-only Sidebar */}
        <div  
          className="bg-dark text-white p-3 d-none d-lg-flex flex-column"
          style={sidebarStyle}
        >
          {/* ⭐️ 12. MODIFIED: Sidebar layout */}
          <div className="flex-grow-1">
            <div
              className={`d-flex align-items-center mb-4 ${
                collapsed ? "justify-content-center" : "justify-content-start"
              }`}
            >
              <img src="/orderly.jpg" alt="Orderly" style={{ height: '32px', width: '32px', borderRadius: '4px' }} />
              {!collapsed && <h5 className="fw-bold ms-2 mb-0">Orderly</h5>}
            </div>
            <SidebarNav  
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              onLinkClick={() => {
                setView("dashboard");
                setSelectedShop(null);
              }}  
            />
          </div>
          
          <div className="mt-auto">
            <Button
              variant="outline-danger"
              className="w-100 mb-2"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-left fs-5"></i>
              {!collapsed && <span className="fw-medium ms-2">Log Out</span>}
            </Button>
            <Button
              variant="outline-light"
              className="w-100"
              onClick={() => setCollapsed(!collapsed)}
            >
              <i
                className={`bi ${
                  collapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"
                } fs-5`}
              ></i>
              {!collapsed && <span className="fw-medium ms-2">Collapse</span>}
            </Button>
          </div>
        </div>

        {/* 3. Main Content Area */}
        <div  
          className="flex-grow-1 p-3 p-lg-4"
          style={{ backgroundColor: '#f8f9fa', height: '100vh', overflowY: 'auto' }}
        >
          {renderMainContent()}
        </div>
      </div>

      {/* 4. Mobile-only Offcanvas Menu */}
      <Offcanvas  
        show={showOffcanvas}  
        onHide={() => setShowOffcanvas(false)}
        className="bg-dark text-white"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="d-flex align-items-center">
            <img src="/orderly.jpg" alt="Orderly" style={{ height: '30px', width: '30px', borderRadius: '4px' }} />
            <span className="ms-2">Orderly</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          {/* ⭐️ 12. MODIFIED: Offcanvas layout */}
          <div className="flex-grow-1">
            <SidebarNav  
              activeTab={activeTab}  
              onSelectTab={handleSelectTab}
              onLinkClick={() => {
                setShowOffcanvas(false);  
                setView("dashboard");
                setSelectedShop(null);
              }}  
            />
          </div>
          <div className="mt-auto">
            <Button
              variant="outline-danger"
              className="w-100"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-left fs-5 me-2"></i>
              <span className="fw-medium">Log Out</span>
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* --- Modals --- */}
      
      {/* 🌍 LOCATION MODAL */}
      <Modal show={showLocationModal} onHide={() => setShowLocationModal(false)} size="lg" centered>
        <Modal.Header closeButton>
           <Modal.Title>Confirm Delivery Location 📍</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           {/* ⭐️ 1. MODIFIED: Handle map loading/error states */}
           {!isLoaded ? (
             <div className="text-center py-5">
               <Spinner animation="border" />
               <p className="mt-2">Loading Map...</p>
             </div>
           ) : loadError ? (
             <Alert variant="danger">
               Error loading maps. Please check your API key and internet connection.
             </Alert>
           ) : (
             <GoogleMap
               mapContainerStyle={mapContainerStyle}
               center={MAP_DEFAULT}
               zoom={12}
               onLoad={onMapLoad}
               onClick={onMapClick}
               onUnmount={() => setMap(null)}
             >
               {selectedLocation && (
                 <MarkerF position={selectedLocation} />
               )}
             </GoogleMap>
           )}
           
           <Button  
             variant="outline-primary"
             className="w-100 mb-3"
             onClick={() => panToCurrentLocation()}
             disabled={geocodingLoading || !isLoaded}
           >
             <i className="bi bi-geo-alt-fill me-2"></i>
             {geocodingLoading ? "Finding..." : "Use My Current Location"}
           </Button>
           <Form.Group className="mb-3">
             <Form.Label>Selected Address</Form.Label>
             <Form.Control
               as="textarea"
               rows={2}
               value={geocodingLoading ? "Finding address..." : address}
               placeholder="Click on the map or use current location..."
               readOnly
             />
           </Form.Group>
           {mapError && <Alert variant="warning" className="small p-2">{mapError}</Alert>}
           <Button
             variant="success"
             className="w-100 mt-3 py-2"
             disabled={!selectedLocation || geocodingLoading || !address || address.includes("Fetching") || address.includes("failed")}
             onClick={() => {
               setShowLocationModal(false);
               setShowPaymentModal(true);
             }}
           >
             Confirm Address & Continue
           </Button>
         </Modal.Body>
      </Modal>

      {/* 💳 PAYMENT MODAL */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
         <Modal.Header closeButton>
           <Modal.Title>Choose Payment Method 💳</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <div className="text-center mb-3 p-3 bg-light rounded-3 border">
             <h5 className="mb-0">Total Amount to Pay</h5>
             <h2 className="fw-bold text-success">₹{orderTotal.toFixed(2)}</h2>
           </div>
           
           <Form>
             <Form.Check
               type="radio"
               id="cod"
               name="paymentMethod"
               label="💵 Cash on Delivery (COD)"
               value="COD"
               checked={paymentMethod === "COD"}
               onChange={(e) => setPaymentMethod(e.target.value)}
               className="mb-3 fs-5 p-3 border rounded-3"
             />
             <Form.Check
               type="radio"
               id="upi"
               name="paymentMethod"
               label="📱 Pay Online (UPI)"
               value="UPI"
               checked={paymentMethod === "UPI"}
               onChange={(e) => setPaymentMethod(e.target.value)}
               className="fs-5 p-3 border rounded-3"
             />
           </Form>
           <hr />
           {paymentMethod === "UPI" ? (
             <div className="text-center">
               <h5 className="fw-semibold mb-3">Scan & Pay via UPI</h5>
               <img
                 src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodedUpiDataQR}`}
                 alt="UPI QR"
                 style={{
                   width: "200px",
                   height: "200px",
                   border: "1px solid #ccc",
                   borderRadius: "8px",
                   padding: "6px",
                 }}
               />
               <div className="border rounded p-2 bg-light mt-3 d-inline-block">
                 <strong>UPI ID:</strong> {UPI_ID}
               </div>
               <p className="small text-muted mt-2">
                 Amount: ₹{orderTotal.toFixed(2)}
               </p>
             </div>
           ) : (
             <div className="text-center">
               <h5 className="fw-semibold mt-2 mb-1">Pay Cash on Delivery</h5>
               <p className="text-muted small">
                 Please keep exact change ready for a smooth delivery.
               </p>
             </div>
           )}
         </Modal.Body>
         <Modal.Footer>
           <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
             Cancel
           </Button>
           <Button variant="primary" onClick={handleConfirmOrder}>
             {paymentMethod === "COD" ? "Confirm Order" : "Confirm Payment"}
           </Button>
         </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerDashboard;