import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from '../utils/axios';

// Import React Bootstrap components
import {
  Container, Nav, Navbar, Offcanvas, Button, Tabs, Tab,
  Card, Row, Col, ListGroup, Badge, Modal, Form, Alert, Image, InputGroup,
  Spinner
} from 'react-bootstrap';

// --- START: Inline SVG Icons ---
// (All icon components are unchanged)
const IconGear = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16" {...props}>
    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.859l-.3-.17c-1.283-.732-2.823.187-2.17 1.585l.153.376c.4.98.226 2.15-.427 2.916l-.23.181c-1.187.93-1.187 2.824 0 3.754l.23.181c.653.766.827 1.936.427 2.916l-.153.376c-.653 1.398 1.01 2.518 2.394 1.686l.2-.117c.594-.342 1.29-.342 1.884 0l.2.117c1.383.832 3.047-.288 2.394-1.686l-.153-.376c-.4-.98-.226-2.15.427 2.916l.23-.181c1.187-.93 1.187-2.824 0 3.754l-.23-.181c-.653-.766-.827 1.936-.427 2.916l.153.376c.653-1.398-1.01-2.518-2.394-1.686l-.2.117a1.464 1.464 0 0 1-1.884 0l-.2-.117a1.464 1.464 0 0 1-2.105-.859l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.858 2.929 2.929 0 0 1 0 5.858z"/>
  </svg>
);
const IconBoxSeam = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-box-seam-fill" viewBox="0 0 16 16" {...props}>
    <path fillRule="evenodd" d="M15.528 2.973a.5.5 0 0 1 .472.472v10.096a.5.5 0 0 1-.472.472L.472 14.472a.5.5 0 0 1-.472-.472V3.445a.5.5 0 0 1 .472-.472L15.528 2.973zM8 8.812a.5.5 0 0 0 0-.024L1.375 5.11 1.002 5.75l6.61 3.44a.5.5 0 0 0 .776 0l6.61-3.44-.373-.64L8 8.812z"/>
    <path d="M16 3.445v10.11a1.5 1.5 0 0 1-1.5 1.5H1.5A1.5 1.5 0 0 1 0 13.554V3.445a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 3.445zm-1.072.292L8.572 2.05a.5.5 0 0 0-.144 0L1.072 3.737a.5.5 0 0 0-.472.472v.005l.002.002 7.025 3.671a.5.5 0 0 0 .776 0L15.993 4.21l.002-.002v-.005a.5.5 0 0 0-.472-.472z"/>
  </svg>
);
const IconChatDots = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-chat-dots-fill" viewBox="0 0 16 16" {...props}>
    <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"/>
  </svg>
);
const IconPersonCircle = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" {...props}>
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
  </svg>
);
const IconBell = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16" {...props}>
    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
  </svg>
);
const IconList = ({ size = 32, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-list" viewBox="0 0 16 16" {...props}>
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
  </svg>
);
const IconBoxArrowLeft = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16" {...props}>
    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
    <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
  </svg>
);
const IconArrowBarLeft = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-arrow-bar-left" viewBox="0 0 16 16" {...props}>
    <path fillRule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
  </svg>
);
const IconArrowBarRight = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-arrow-bar-right" viewBox="0 0 16 16" {...props}>
    <path fillRule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
  </svg>
);
const IconSearch = ({ size = 16, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-search" viewBox="0 0 16 16" {...props}>
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
);
const IconX = ({ size = 16, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-x" viewBox="0 0 16 16" {...props}>
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
  </svg>
);
const IconEye = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16" {...props}>
    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
  </svg>
);
const IconEyeSlash = ({ size = 22, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16" {...props}>
    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM11.257 10.96a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.947-2.947a2.5 2.5 0 0 0-2.829-2.829l-.822-.822a3.5 3.5 0 0 1 4.474 4.474l-.823-.823z"/>
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 6.803a.5.5 0 0 1 .708-.707l12.5 12.5a.5.5 0 0 1-.707.708L1.173 6.803z"/>
  </svg>
);
// --- END: Inline SVG Icons ---


// --- CSS for layout ---
// (GlobalStyles component is unchanged)
const SIDEBAR_WIDTH_DESKTOP = 280; // in pixels
const SIDEBAR_WIDTH_COLLAPSED = 88; // in pixels

const GlobalStyles = () => (
  <style type="text/css">{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    :root {
      --sidebar-width: ${SIDEBAR_WIDTH_DESKTOP}px;
      --sidebar-width-collapsed: ${SIDEBAR_WIDTH_COLLAPSED}px;
      --bs-primary-rgb: 13, 110, 253; 
      --bs-border-radius: 0.375rem;
    }
    body, .dashboard-layout {
      font-family: 'Inter', sans-serif;
    }
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    .dashboard-sidebar {
      width: var(--sidebar-width);
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
      transition: width 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border-right: none;
    }
    .dashboard-sidebar.collapsed {
      width: var(--sidebar-width-collapsed);
    }
    .dashboard-main {
      flex: 1;
      margin-left: var(--sidebar-width);
      transition: margin-left 0.3s ease;
    }
    .dashboard-main.sidebar-collapsed {
      margin-left: var(--sidebar-width-collapsed);
    }
    .sidebar-nav .nav-link {
      color: #adb5bd; 
      transition: background-color 0.2s ease, color 0.2s ease;
      border-radius: var(--bs-border-radius);
    }
    .sidebar-nav .nav-link:hover,
    .sidebar-nav .nav-link:focus {
      color: #ffffff;
      background-color: #343a40; 
    }
    .sidebar-nav .nav-link.active {
      color: #ffffff;
      background-color: #0d6efd; 
      box-shadow: 0 2px 4px rgba(13, 110, 253, 0.3);
    }
    .sidebar-nav .nav-link.active svg {
      color: #ffffff;
    }
    .nav-text {
      opacity: 1;
      transition: opacity 0.2s ease;
      white-space: nowrap;
    }
    .dashboard-sidebar.collapsed .nav-text {
      opacity: 0;
      width: 0;
      pointer-events: none;
    }
    .sidebar-nav .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem; 
    }
    .dashboard-sidebar.collapsed .sidebar-nav .nav-link {
      justify-content: center;
    }
    .dashboard-sidebar.collapsed .sidebar-nav .nav-link svg {
      margin-right: 0 !important;
    }
    .nav-tabs {
      border-bottom: 2px solid #dee2e6; 
    }
    .nav-tabs .nav-link {
      border: none;
      background-color: transparent;
      color: #6c757d; 
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      font-weight: 500;
      transition: border-color 0.2s ease, color 0.2s ease;
    }
    .nav-tabs .nav-link:hover,
    .nav-tabs .nav-link:focus {
      color: #0d6efd; 
      border-bottom-color: #0d6efd;
    }
    .nav-tabs .nav-link.active {
      color: #0d6efd;
      font-weight: 600;
      border-bottom: 2px solid #0d6efd;
      background-color: transparent;
    }
    .nav-tabs.nav-fill .nav-link {
      flex-basis: auto;
      flex-grow: 0;
      margin-right: 1.5rem;
    }
    @media (max-width: 576px) {
      .nav-tabs.nav-fill .nav-link {
        flex-basis: 0;
        flex-grow: 1;
        margin-right: 0;
      }
    }
    .btn {
      border-radius: var(--bs-border-radius);
      font-weight: 500;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .btn-primary {
      box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.2);
    }
    .btn-primary:hover, .btn-primary:focus {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(var(--bs-primary-rgb), 0.25);
    }
    .form-control, .form-select {
      border-radius: var(--bs-border-radius);
      border-color: #ced4da; 
    }
    .form-control:focus, .form-select:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.2);
      outline: none;
    }
    .modal-content {
      border: none;
      border-radius: 0.5rem; 
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .bar-chart-container {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 300px;
      padding: 20px;
      border: 1px solid #dee2e6;
      border-radius: var(--bs-border-radius);
      background-color: #f8f9fa;
    }
    .bar-chart-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .bar {
      width: 40px;
      background-color: #0d6efd;
      margin: 0 10px;
      transition: height 0.5s ease-out;
      border-radius: 4px 4px 0 0;
    }
    .bar-label {
      font-size: 0.8rem;
      margin-top: 8px;
      font-weight: 500;
      color: #6c757d;
    }
    @media (max-width: 767.98px) {
      .dashboard-sidebar {
        display: none; 
      }
      .dashboard-main {
        margin-left: 0;
      }
      .dashboard-main.sidebar-collapsed {
        margin-left: 0;
      }
    }
  `}</style>
);

// --- START: Tab Content Components ---

// --- 1. Manage Content ---
// (Component structure is unchanged)
const ManageContent = ({
  menuItems, inventory, onSaveItem, onDeleteItem,
  onSaveInventoryUpdate, onSaveAddInventory,
  menuSearch, setMenuSearch, inventorySearch, setInventorySearch,
  loadingMenu, loadingInventory
}) => {
  
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [isEditingMenu, setIsEditingMenu] = useState(null);
  const [showUpdateInventoryModal, setShowUpdateInventoryModal] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);

  // --- Menu Modal ---
  const handleShowMenuModal = (item) => {
    setIsEditingMenu(item ? item : null);
    setShowMenuModal(true);
  };
  const handleCloseMenuModal = () => {
    setShowMenuModal(false);
    setIsEditingMenu(null);
  };
  
  // --- Inventory *Update* Modal ---
  const handleShowUpdateInventoryModal = (item) => {
    setEditingInventory(item);
    setShowUpdateInventoryModal(true);
  };
  const handleCloseUpdateInventoryModal = () => {
    setShowUpdateInventoryModal(false);
    setEditingInventory(null);
  };
  
  // --- Inventory *Add* Modal ---
  const handleShowAddInventoryModal = () => setShowAddInventoryModal(true);
  const handleCloseAddInventoryModal = () => setShowAddInventoryModal(false);

  // --- Save Handlers (Call parent function) ---
  const handleSaveItem = (event) => {
    event.preventDefault();
    onSaveItem(event, isEditingMenu);
    handleCloseMenuModal();
  };

  const handleSaveInventoryUpdate = (event) => {
    event.preventDefault();
    onSaveInventoryUpdate(event, editingInventory);
    handleCloseUpdateInventoryModal();
  };
  
  const handleSaveAddInventory = (event) => {
    event.preventDefault();
    onSaveAddInventory(event);
    handleCloseAddInventoryModal();
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      onDeleteItem(id);
    }
  };
  
  // --- Filtered Lists ---
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(menuSearch.toLowerCase())
  );
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <Container fluid>
      <h2 className="mb-4">Manage Shop</h2>
      
      <Tabs defaultActiveKey="menu" id="manage-tabs" className="mb-3" fill>
        
        {/* === MENU ITEMS TAB === */}
        <Tab eventKey="menu" title="Menu Items" unmountOnExit>
          <Row className="mb-3">
            <Col md={8}>
              <Button variant="primary" onClick={() => handleShowMenuModal(null)} className="shadow-sm">
                Add New Menu Item
              </Button>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><IconSearch /></InputGroup.Text>
                <Form.Control 
                  type="search" 
                  placeholder="Search menu items..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
          
          {loadingMenu ? (
            <div className="text-center p-5"><Spinner animation="border" /></div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredMenuItems.map(item => (
                <Col key={item._id}> 
                  <Card className="shadow-sm h-100 border-0 rounded-3">
                    <Card.Img variant="top" src={item.photo?.url || 'https://placehold.co/400x300/eee/ccc?text=No+Image'} style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem' }} />
                    <Card.Body className="d-flex flex-column p-4">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text className="text-muted small">{item.description}</Card.Text>
                      <Card.Text as="h5" className="mt-auto">₹{item.price}</Card.Text>
                      <div className="mt-2">
                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowMenuModal(item)}>
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem(item._id)}> 
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        {/* === INVENTORY TAB === */}
        <Tab eventKey="inventory" title="Inventory (Stock)" unmountOnExit>
          <Row className="mb-3">
            <Col md={8}>
              <Button variant="primary" onClick={handleShowAddInventoryModal} className="shadow-sm">
                Add New Inventory Item
              </Button>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><IconSearch /></InputGroup.Text>
                <Form.Control 
                  type="search" 
                  placeholder="Search inventory..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
          
          {loadingInventory ? (
            <div className="text-center p-5"><Spinner animation="border" /></div>
          ) : (
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Header as="h5" className="bg-white border-0 p-4">Current Stock Levels</Card.Header>
              <ListGroup variant="flush">
                {filteredInventory.map(item => (
                  <ListGroup.Item key={item._id} className="px-4 py-3 d-flex justify-content-between align-items-center"> 
                    <div>
                      <span className="fw-bold">{item.name}</span>
                      <Badge 
                        bg={item.currentStock / item.totalStock < 0.2 ? 'danger' : (item.currentStock / item.totalStock < 0.5 ? 'warning' : 'success')} 
                        text={item.currentStock / item.totalStock < 0.5 ? 'dark' : 'light'}
                        pill 
                        className="p-2 ms-3"
                      >
                        {item.currentStock} / {item.totalStock} remaining
                      </Badge>
                    </div>
                    <Button variant="outline-primary" size="sm" onClick={() => handleShowUpdateInventoryModal(item)}>
                      Update
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
        </Tab>
      </Tabs>

      {/* === Add/Edit Item Modal === */}
      <Modal show={showMenuModal} onHide={handleCloseMenuModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditingMenu ? 'Edit Menu Item' : 'Add New Menu Item'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveItem}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formItemName">
              <Form.Label>Dish Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={isEditingMenu?.name} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formItemDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" defaultValue={isEditingMenu?.description} required />
            </Form.Group>
            <Row>
              <Col><Form.Group className="mb-3" controlId="formItemPrice">
                <Form.Label>Price (₹)</Form.Label>
                <Form.Control type="number" name="price" defaultValue={isEditingMenu?.price} required />
              </Form.Group></Col>
              <Col><Form.Group className="mb-3" controlId="formItemPhoto">
                <Form.Label>Photo</Form.Label>
                <Form.Control type="file" name="photo" accept="image/*" />
              </Form.Group></Col>
            </Row>
             <Row>
              <Col><Form.Check type="switch" id="hasStock" name="hasStock" label="Track Stock?" defaultChecked={isEditingMenu?.hasStock} /></Col>
              <Col><Form.Group controlId="formTotalStock"><Form.Label>Total Stock</Form.Label><Form.Control type="number" name="totalStock" defaultValue={isEditingMenu?.totalStock || 0} /></Form.Group></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseMenuModal}>Close</Button>
            <Button variant="primary" type="submit">{isEditingMenu ? 'Save Changes' : 'Add Item'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* === Update Inventory Modal === */}
      <Modal show={showUpdateInventoryModal} onHide={handleCloseUpdateInventoryModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Stock: {editingInventory?.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveInventoryUpdate}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formCurrentStock">
                  <Form.Label>Current Stock</Form.Label>
                  <Form.Control type="number" name="currentStock" defaultValue={editingInventory?.currentStock} required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formTotalStock">
                  <Form.Label>Total Stock</Form.Label>
                  <Form.Control type="number" name="totalStock" defaultValue={editingInventory?.totalStock} required />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUpdateInventoryModal}>Close</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* --- Add Inventory Modal --- */}
      <Modal show={showAddInventoryModal} onHide={handleCloseAddInventoryModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Inventory Item</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveAddInventory}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formNewItemName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="e.g., Onions (kg)" required />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formNewCurrentStock">
                  <Form.Label>Current Stock</Form.Label>
                  <Form.Control type="number" name="currentStock" defaultValue={0} required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formNewTotalStock">
                  <Form.Label>Total Stock</Form.Label>
                  <Form.Control type="number" name="totalStock" defaultValue={0} required />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddInventoryModal}>Close</Button>
            <Button variant="primary" type="submit">Add Item</Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </Container>
  );
};

// --- 2. Orders Content ---
// (Component structure is unchanged)
const OrdersContent = ({ upcomingOrders, presentOrders, onUpdateOrder, loading }) => {

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateOrder(orderId, newStatus);
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Orders</h2>
      
      <Tabs defaultActiveKey="upcoming" id="order-tabs" className="mb-3" fill>
        
        {/* === UPCOMING (NEW) ORDERS === */}
        <Tab eventKey="upcoming" title={`Upcoming (${upcomingOrders.length})`} unmountOnExit>
          <h4 className="mb-3">New Orders to Confirm</h4>
          {loading ? (
             <div className="text-center p-5"><Spinner animation="border" /></div>
           ) : upcomingOrders.length > 0 ? upcomingOrders.map(order => (
            <Card key={order._id} className="mb-3 shadow-sm border-0 rounded-3"> 
              <Card.Header className="d-flex justify-content-between align-items-center p-3 bg-white border-0" style={{ borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem' }}>
                <span className="fw-bold">Order #{order._id.slice(-6)} - {order.customer?.name || 'Customer'}</span> 
                <span className="text-muted small">Date: {new Date(order.orderDate).toLocaleDateString()}</span>
              </Card.Header>
              <Card.Body className="p-3">
                <Card.Text>
                  <strong>Items:</strong> {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}<br />
                  <strong className="text-muted">Address:</strong> <span className="text-muted">{order.deliveryAddress}</span>
                </Card.Text>
                <Button variant="success" className="me-2" onClick={() => onUpdateOrder(order._id, 'accepted')}>Accept</Button> 
                <Button variant="danger" onClick={() => onUpdateOrder(order._id, 'rejected')}>Deny</Button> 
              </Card.Body>
            </Card>
          )) : <Alert variant="info">No new orders.</Alert>}
        </Tab>
        
        {/* === PRESENT (ONGOING) ORDERS === */}
        <Tab eventKey="present" title={`Present (${presentOrders.length})`} unmountOnExit>
          <h4 className="mb-3">Current Order Status</h4>
          {loading ? (
             <div className="text-center p-5"><Spinner animation="border" /></div>
           ) : presentOrders.length > 0 ? (
            <ListGroup className="shadow-sm border-0 rounded-3">
              {presentOrders.map(order => (
                <ListGroup.Item key={order._id} className="p-3"> 
                  <Row className="align-items-center">
                    <Col md={5}>
                      <div className="fw-bold">Order #{order._id.slice(-6)}</div> 
                      {order.customer?.name || 'Customer'}
                      <div className="text-muted small">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')} | {order.deliveryAddress}
                      </div>
                    </Col>
                    <Col md={4}>
                      <Form.Select
                        size="sm"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)} // ⭐️ Use ._id
                        className={
                          order.status === 'delivered' ? 'border-success text-success' :
                          order.status === 'ongoing' ? 'border-primary text-primary' :
                          'border-warning text-warning' // 'accepted'
                        }
                        style={{ fontWeight: 500 }}
                      >
                        <option value="accepted">Accepted</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="delivered">Delivered</option>
                      </Form.Select>
                    </Col>
                    <Col md={3} className="text-end">
                      <Badge 
                        bg={order.status === 'delivered' ? 'success' : (order.status === 'ongoing' ? 'primary' : 'warning')} 
                        text={order.status === 'delivered' ? 'light' : 'dark'}
                        pill 
                        className="p-2"
                      >
                        {order.status}
                      </Badge>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : <Alert variant="info">No ongoing orders.</Alert>}
        </Tab>
      </Tabs>
    </Container>
  );
};

// --- 3. Complaints Content ---
// (Component structure is unchanged)
const ComplaintsContent = ({
  customerComplaints, myComplaints,
  loadingComplaints, loadingMyComplaints,
  onSubmitComplaint, onDeleteMyComplaint
}) => {

  return (
    <Container fluid>
      <h2 className="mb-4">Complaints</h2>
      <Tabs defaultActiveKey="upcoming" id="complaint-tabs" className="mb-3" fill>
        <Tab eventKey="upcoming" title={`From Customers (${customerComplaints.length})`} unmountOnExit>
          <h4 className="mb-3">New Complaints from Customers</h4>
          {loadingComplaints ? (
            <div className="text-center p-5"><Spinner animation="border" /></div>
          ) : customerComplaints.length > 0 ? customerComplaints.map(comp => (
            <Card key={comp._id} className="mb-3 shadow-sm border-0 rounded-3"> 
              <Card.Header className="d-flex justify-content-between align-items-center p-3 bg-white border-0" style={{ borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem' }}>
                <span className="fw-bold">{comp.subject}</span>
                <span className="text-muted small">From: {comp.fromUser?.email || 'Customer'}</span>
              </Card.Header>
              <Card.Body className="p-3">
                <Card.Text>"{comp.message}"</Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted small bg-white border-0 p-3">Status: {comp.status}</Card.Footer>
            </Card>
          )) : <Alert variant="info">No new complaints from customers.</Alert>}
        </Tab>
        <Tab eventKey="my-complaints" title="My Complaints (to Admin)" unmountOnExit>
          <h4 className="mb-3">File a New Complaint to Admin</h4>
          <Card className="mb-4 shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <Form onSubmit={onSubmitComplaint}>
                <Form.Group className="mb-3" controlId="formComplaintSubject"><Form.Label>Subject</Form.Label><Form.Control name="subject" type="text" placeholder="e.g., Issue with payout" required /></Form.Group>
                <Form.Group className="mb-3" controlId="formComplaintDesc"><Form.Label>Description</Form.Label><Form.Control name="message" as="textarea" rows={4} placeholder="Please describe the issue in detail" required /></Form.Group>
                <Button variant="primary" type="submit">Submit to Admin</Button>
              </Form>
            </Card.Body>
          </Card>
          <h4 className="mb-3">My Complaint History</h4>
          {loadingMyComplaints ? (
            <div className="text-center p-5"><Spinner animation="border" /></div>
          ) : (
            <ListGroup className="shadow-sm border-0 rounded-3">
              {myComplaints.map(comp => (
                <ListGroup.Item key={comp._id} className="d-flex justify-content-between align-items-center p-3"> 
                  <div>
                    {comp.subject}
                    <Badge bg={comp.status === 'resolved' ? 'success' : 'warning'} text={comp.status === 'resolved' ? 'light' : 'dark'} pill className="ms-3">{comp.status}</Badge>
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={() => onDeleteMyComplaint(comp._id)}> 
                    Delete
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

// --- 4. Profile Content ---
const ProfileContent = ({
  profile, onProfileUpdate, onBankUpdate, onPasswordUpdate,
  incomeData, loadingProfile, loadingIncome
}) => {
  // ⭐️ MODIFIED: Set placeholder as default
  const [profileImage, setProfileImage] = useState('https://placehold.co/150x150/0d6efd/white?text=Shop+Logo');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ⭐️ MODIFIED: Update image from profile.shopLogo.url
  useEffect(() => {
    if (profile && profile.shopLogo && profile.shopLogo.url) {
      setProfileImage(profile.shopLogo.url);
    }
  }, [profile]);

  // ⭐️ MODIFIED: This handler now ONLY updates the image preview.
  // The main onProfileUpdate handler will do the submitting.
  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const renderChart = (data, maxValue) => (
    <div className="bar-chart-container">
      {data.map(item => (
        <div key={item.label} className="bar-chart-wrapper">
          <div 
            className="bar" 
            style={{ height: `${(item.value / maxValue) * 100}%` }}
            title={`₹${item.value}`}
          ></div>
          <span className="bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  );

  const IncomeChart = () => (
    <Tabs defaultActiveKey="daily" id="chart-tabs" className="mb-3">
      <Tab eventKey="daily" title="Daily Sales">
        {loadingIncome ? <Spinner /> : renderChart(incomeData.daily, 10000)}
      </Tab>
      <Tab eventKey="monthly" title="Monthly Sales">
        {loadingIncome ? <Spinner /> : renderChart(incomeData.monthly, 250000)}
      </Tab>
    </Tabs>
  );

  return (
    <Container fluid>
      <h2 className="mb-4">My Profile</h2>
      {loadingProfile ? (
        <div className="text-center p-5"><Spinner animation="border" /></div>
      ) : (
        <Tabs defaultActiveKey="profile" id="profile-tabs" className="mb-3" fill>
          {/* === UPDATE PROFILE === */}
          <Tab eventKey="profile" title="Update Profile" unmountOnExit>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body className="p-4 p-md-5">
                <Card.Title as="h4" className="mb-4">Edit Your Information</Card.Title>
                
                {/* ⭐️ MODIFIED: Removed '(e, false)' from onSubmit */}
                <Form onSubmit={onProfileUpdate}>
                  <Row className="mb-4">
                    <Col xs="auto">
                      <Image src={profileImage} roundedCircle width={120} height={120} />
                    </Col>
                    <Col>
                      <Form.Group controlId="formProfileImage">
                        <Form.Label>Restaurant Logo/Image</Form.Label>
                        <Form.Control type="file" onChange={handleImageUpload} name="shopLogo" accept="image/*" />
                        <Form.Text muted>Upload a new image for your restaurant.</Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}><Form.Group className="mb-3" controlId="formProfileName"><Form.Label>Full Name</Form.Label><Form.Control name="name" type="text" defaultValue={profile?.name} /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3" controlId="formProfileShop"><Form.Label>Shop Name</Form.Label><Form.Control name="shopName" type="text" defaultValue={profile?.shopName} /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3" controlId="formProfileEmail"><Form.Label>Email Address</Form.Label><Form.Control name="email" type="email" defaultValue={profile?.email} /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3" controlId="formProfilePhone"><Form.Label>Phone Number</Form.Label><Form.Control name="phone" type="tel" defaultValue={profile?.phone} /></Form.Group></Col>
                    
                    {/* ⭐️ MODIFIED: Added fields from your backend model */}
                    <Col md={6}><Form.Group className="mb-3" controlId="formOpeningTime"><Form.Label>Opening Time</Form.Label><Form.Control name="openingTime" type="time" defaultValue={profile?.openingTime || "09:00"} /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3" controlId="formClosingTime"><Form.Label>Closing Time</Form.Label><Form.Control name="closingTime" type="time" defaultValue={profile?.closingTime || "22:00"} /></Form.Group></Col>
                  
                  </Row>
                  <Button variant="primary" type="submit">Save Profile Changes</Button>
                </Form>
                
                <hr className="my-4" />
                <h5 className="mb-3">Change Password</h5>
                {/* (Password form is unchanged) */}
                <Form onSubmit={onPasswordUpdate}>
                   <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formProfilePassword">
                        <Form.Label>New Password</Form.Label>
                        <InputGroup>
                          <Form.Control 
                            name="newPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Leave blank to keep unchanged" 
                          />
                          <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)} style={{ width: "42px" }}>
                            {showPassword ? <IconEyeSlash size={16} /> : <IconEye size={16} />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formProfilePasswordConfirm">
                        <Form.Label>Confirm New Password</Form.Label>
                        <InputGroup>
                          <Form.Control 
                            name="confirmPassword" 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm new password" 
                          />
                          <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ width: "42px" }}>
                            {showConfirmPassword ? <IconEyeSlash size={16} /> : <IconEye size={16} />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="secondary" type="submit">Change Password</Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
          {/* === INCOME VISUALIZATION === */}
          <Tab eventKey="income" title="Income Visualization" unmountOnExit>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body className="p-4 p-md-5">
                <Card.Title as="h4" className="mb-4">Your Earnings</Card.Title>
                <IncomeChart />
              </Card.Body>
            </Card>
          </Tab>
          {/* === WITHDRAW (BANK A/C) === */}
          <Tab eventKey="withdraw" title="Withdraw" unmountOnExit>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body className="p-4 p-md-5">
                <Card.Title as="h4" className="mb-4">Bind Bank Account</Card.Title>
                <Form onSubmit={onBankUpdate}>
                  <Row>
                    <Col md={12}><Form.Group className="mb-3" controlId="formBankName"><Form.Label>Bank Name</Form.Label><Form.Control name="bankName" type="text" placeholder="e.g., State Bank of India" defaultValue={profile?.bankDetails?.bankName} /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3" controlId="formBankAc"><Form.Label>Account Number</Form.Label><Form.Control name="accountNumber" type="text" placeholder="Enter your A/C number" defaultValue={profile?.bankDetails?.accountNumber} /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3" controlId="formBankIfsc"><Form.Label>IFSC Code</Form.Label><Form.Control name="ifscCode" type="text" placeholder="Enter IFSC code" defaultValue={profile?.bankDetails?.ifscCode} /></Form.Group></Col>
                  </Row>
                  <Button variant="primary" type="submit">Bind Bank Account</Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

// --- 5. Notifications Content ---
// (Component structure is unchanged)
const NotificationsContent = ({ notifications, loading, onDelete, onClearAll }) => {

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Notifications</h2>
        {notifications.length > 0 && (
          <Button variant="outline-danger" size="sm" onClick={onClearAll}>
            Clear All Notifications
          </Button>
        )}
      </div>
      <p className="text-muted">Messages from the Admin team.</p>
      
      {loading ? (
        <div className="text-center p-5"><Spinner animation="border" /></div>
      ) : notifications.length > 0 ? (
        <ListGroup className="shadow-sm border-0 rounded-3">
          {notifications.map(note => (
            <ListGroup.Item key={note._id} as="li" className="p-3"> 
              <div className="d-flex w-100 justify-content-between">
                <p className="mb-1">{note.message}</p>
                <small className="text-nowrap ms-3">{new Date(note.date).toLocaleDateString()}</small>
                <Button variant="link" className="text-danger p-0 ms-3" onClick={() => onDelete(note._id)} title="Delete Notification"> 
                  <IconX size={20} />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="info">
          You have no new notifications.
        </Alert>
      )}
    </Container>
  );
};

// --- END: Tab Content Components ---


// --- Reusable Navigation Menu ---
// (Component structure is unchanged)
const DashboardNavMenu = ({ activeTab, setActiveTab, isCollapsed, onLinkClick }) => {
  const handleLinkClick = (tabKey) => {
    setActiveTab(tabKey);
    if (onLinkClick) {
      onLinkClick();
    }
  };
  const navItems = [
    { key: "manage", icon: <IconGear size={22} />, text: "Manage" },
    { key: "orders", icon: <IconBoxSeam size={22} />, text: "Orders" },
    { key: "complaints", icon: <IconChatDots size={22} />, text: "Complaints" },
    { key: "notifications", icon: <IconBell size={22} />, text: "Notifications" },
    { key: "profile", icon: <IconPersonCircle size={22} />, text: "Profile" },
  ];

  return (
    <Nav variant="pills" className="flex-column sidebar-nav">
      {navItems.map((item) => (
        <Nav.Item key={item.key} className="mb-1">
          <Nav.Link
            href="#"
            active={activeTab === item.key}
            onClick={(e) => { e.preventDefault(); handleLinkClick(item.key); }}
            className="p-3"
            title={isCollapsed ? item.text : ""}
          >
            {item.icon}
            <span className="nav-text fw-medium">{item.text}</span>
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

// --- Content Renderer ---
// (Component structure is unchanged)
const RenderActiveTab = ({ 
  activeTab, 
  // Pass all state and handlers down
  // Manage
  menuItems, inventory, handleSaveItem, handleDeleteItem,
  handleSaveInventoryUpdate, handleSaveAddInventory,
  menuSearch, setMenuSearch, inventorySearch, setInventorySearch,
  loadingMenu, loadingInventory,
  // Orders
  upcomingOrders, presentOrders, handleUpdateOrder, loadingOrders,
  // Complaints
  customerComplaints, myComplaints, loadingComplaints, loadingMyComplaints,
  handleSubmitComplaint, handleDeleteMyComplaint,
  // Notifications
  notifications, loadingNotifications, handleDeleteNotification, handleClearAllNotifications,
  // Profile
  profile, handleProfileUpdate, handleBankUpdate, handlePasswordUpdate,
  incomeData, loadingProfile, loadingIncome
}) => {
  switch (activeTab) {
    case 'manage': return <ManageContent 
      menuItems={menuItems}
      inventory={inventory}
      onSaveItem={handleSaveItem}
      onDeleteItem={handleDeleteItem}
      onSaveInventoryUpdate={handleSaveInventoryUpdate}
      onSaveAddInventory={handleSaveAddInventory}
      menuSearch={menuSearch}
      setMenuSearch={setMenuSearch}
      inventorySearch={inventorySearch}
      setInventorySearch={setInventorySearch}
      loadingMenu={loadingMenu}
      loadingInventory={loadingInventory}
    />;
    case 'orders': return <OrdersContent 
      upcomingOrders={upcomingOrders}
      presentOrders={presentOrders}
      onUpdateOrder={handleUpdateOrder}
      loading={loadingOrders}
    />;
    case 'complaints': return <ComplaintsContent
      customerComplaints={customerComplaints}
      myComplaints={myComplaints}
      loadingComplaints={loadingComplaints}
      loadingMyComplaints={loadingMyComplaints}
      onSubmitComplaint={handleSubmitComplaint}
      onDeleteMyComplaint={handleDeleteMyComplaint}
    />;
    case 'notifications': return <NotificationsContent
      notifications={notifications}
      loading={loadingNotifications}
      onDelete={handleDeleteNotification}
      onClearAll={handleClearAllNotifications}
    />;
    case 'profile': return <ProfileContent
      profile={profile}
      onProfileUpdate={handleProfileUpdate}
      onBankUpdate={handleBankUpdate}
      onPasswordUpdate={handlePasswordUpdate}
      incomeData={incomeData}
      loadingProfile={loadingProfile}
      loadingIncome={loadingIncome}
    />;
    default: return <ManageContent 
      menuItems={menuItems}
      inventory={inventory}
      onSaveItem={handleSaveItem}
      onDeleteItem={handleDeleteItem}
      onSaveInventoryUpdate={handleSaveInventoryUpdate}
      onSaveAddInventory={handleSaveAddInventory}
      menuSearch={menuSearch}
      setMenuSearch={setMenuSearch}
      inventorySearch={inventorySearch}
      setInventorySearch={setInventorySearch}
      loadingMenu={loadingMenu}
      loadingInventory={loadingInventory}
    />;
  }
};


// --- Static data for income chart ---
// (Unchanged)
const staticIncomeData = {
  daily: [
    { label: 'Mon', value: 3200 },
    { label: 'Tue', value: 4500 },
    { label: 'Wed', value: 2100 },
    { label: 'Thu', value: 5800 },
    { label: 'Fri', value: 7100 },
    { label: 'Sat', value: 9200 },
    { label: 'Sun', value: 8100 },
  ],
  monthly: [
    { label: 'Jan', value: 120000 },
    { label: 'Feb', value: 150000 },
    { label: 'Mar', value: 130000 },
    { label: 'Apr', value: 180000 },
    { label: 'May', value: 160000 },
    { label: 'Jun', value: 210000 },
  ]
};


// --- ⭐️ The Main Dashboard Layout Component ⭐️ ---
const DashboardLayout = () => {
  // --- Auth & Navigation ---
  const { logout } = useAuth();
  const navigate = useNavigate();

  // --- Layout State ---
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem('activeDashboardTab') || 'manage'
  );

  // --- Data State ---
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [upcomingOrders, setUpcomingOrders] = useState([]);
  const [presentOrders, setPresentOrders] = useState([]);
  const [customerComplaints, setCustomerComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [incomeData, setIncomeData] = useState(staticIncomeData);

  // --- Loading State ---
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingMyComplaints, setLoadingMyComplaints] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingIncome, setLoadingIncome] = useState(true);
  
  // --- Search State ---
  const [menuSearch, setMenuSearch] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");

  // --- Data Fetching Functions ---
  // (All fetch functions are unchanged)
  const fetchMenuAndInventory = async () => {
    setLoadingMenu(true);
    setLoadingInventory(true);
    try {
      const response = await axios.get('/api/owner/manage/inventory');
      setMenuItems(response.data.filter(item => item.price > 0)); 
      setInventory(response.data.filter(item => item.hasStock));
    } catch (err) {
      console.error("Error fetching menu/inventory:", err);
      alert("Could not load shop data. " + err.response?.data?.message);
    } finally {
      setLoadingMenu(false);
      setLoadingInventory(false);
    }
  };
  
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const upcomingRes = await axios.get('/api/owner/orders/upcoming');
      const presentRes = await axios.get('/api/owner/orders/present');
      setUpcomingOrders(upcomingRes.data);
      setPresentOrders(presentRes.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Could not load orders. " + err.response?.data?.message);
    } finally {
      setLoadingOrders(false);
    }
  };
  
  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    setLoadingMyComplaints(true);
    try {
      const customerRes = await axios.get('/api/owner/complaints/upcoming');
      const myRes = await axios.get('/api/owner/complaints/my');
      setCustomerComplaints(customerRes.data);
      setMyComplaints(myRes.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      alert("Could not load complaints. " + err.response?.data?.message);
    } finally {
      setLoadingComplaints(false);
      setLoadingMyComplaints(false);
    }
  };
  
  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await axios.get('/api/owner/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      alert("Could not load notifications. " + err.response?.data?.message);
    } finally {
      setLoadingNotifications(false);
    }
  };
  
  const fetchProfileAndIncome = async () => {
    setLoadingProfile(true);
    setLoadingIncome(true); // Keep this to show spinner
    try {
      const profileRes = await axios.get('/api/owner/profile');
      setProfile(profileRes.data);
      
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Could not load profile. " + err.response?.data?.message);
    } finally {
      setLoadingProfile(false);
      // Set loadingIncome to false, data is already static
      setLoadingIncome(false); 
    }
  };

  // --- Layout Effects ---
  // (Unchanged)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) setShowMobileNav(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeDashboardTab', activeTab);
    
    // Fetch data based on the active tab
    if (activeTab === 'manage') {
      fetchMenuAndInventory();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'complaints') {
      fetchComplaints();
    } else if (activeTab === 'notifications') {
      fetchNotifications();
    } else if (activeTab === 'profile') {
      fetchProfileAndIncome();
    }
  }, [activeTab]); 

  // --- Logout Handler ---
  // (Unchanged)
  const handleLogout = () => {
    logout(); // This clears context and local storage
    navigate('/'); // Redirect to home/login page
  };

  // --- ⭐️ API Action Handlers (MODIFIED) ⭐️ ---

  // Modified: Enhanced FormData formatting and error handling
  const handleSaveItem = async (event, editingItem) => {
    event.preventDefault();

    // Create fresh FormData
    const formData = new FormData();
    
    // Get form values
    const name = event.target.name.value;
    const description = event.target.description.value;
    const price = parseFloat(event.target.price.value);
    const hasStock = event.target.hasStock.checked;
    const totalStock = parseInt(event.target.totalStock.value, 10) || 0;
    const photo = event.target.photo.files[0];

    // Validate required fields
    if (!name || !description || isNaN(price) || price < 0) {
      alert('Please fill in all required fields correctly');
      return;
    }

    // Append all fields to FormData with proper types
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('hasStock', hasStock);
    formData.append('totalStock', totalStock);
    
    // Only append photo if one was selected
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      // Log form data contents for debugging
      console.log('Form data contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('upload progress:', percentCompleted);
        },
      };

      let response;
      if (editingItem) {
        console.log('Updating menu item:', editingItem._id);
        response = await axios.put(
          `/api/owner/manage/menu/${editingItem._id}`,
          formData,
          config
        );
      } else {
        console.log('Creating new menu item');
        response = await axios.post('/api/owner/manage/menu', formData, config);
      }

      console.log('Server response:', response.data);
      alert(editingItem ? 'Item updated successfully!' : 'Item added successfully!');
      fetchMenuAndInventory(); // Refetch data
    } catch (err) {
      console.error("Error saving item:", err);
      let errorMessage = "Error saving item: ";
      
      if (err.response) {
        // Server responded with an error
        errorMessage += err.response.data.message || err.response.statusText;
        console.error("Server error details:", err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage += "No response from server. Please check your connection.";
      } else {
        // Error in request setup
        errorMessage += err.message;
      }
      
      alert(errorMessage);
    }
  };
  
  // (Unchanged)
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/api/owner/manage/menu/${id}`);
      alert('Item deleted!');
      fetchMenuAndInventory(); // Refetch
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Error deleting item: " + err.response?.data?.message);
    }
  };
  
  // ⭐️ MODIFIED: Switched to sending FormData
  // This is required because the route now uses upload middleware.
  const handleSaveInventoryUpdate = async (event, editingItem) => {
    event.preventDefault(); 
    
    // Create FormData from the form
    const formData = new FormData(event.target);
    
    try {
      // Send FormData. The backend will only update stock fields.
      await axios.put(`/api/owner/manage/menu/${editingItem._id}`, formData);
      alert('Inventory updated!');
      fetchMenuAndInventory(); // Refetch
    } catch (err) {
      console.error("Error updating inventory:", err);
      alert("Error updating inventory: " + err.response?.data?.message);
    }
  };

  // ⭐️ MODIFIED: Switched to sending FormData
  // This is required because the route now uses upload middleware.
  const handleSaveAddInventory = async (event) => {
    event.preventDefault(); 
    
    // Manually build FormData to add the extra fields
    const formData = new FormData();
    const raw = new FormData(event.target);
    
    formData.append('name', raw.get('name'));
    formData.append('currentStock', parseFloat(raw.get('currentStock')));
    formData.append('totalStock', parseFloat(raw.get('totalStock')));
    
    // Add default fields for inventory-only items
    formData.append('price', 0);
    formData.append('description', 'Inventory Item');
    formData.append('hasStock', true);
  
    try {
      await axios.post('/api/owner/manage/menu', formData);
      alert('Inventory item added!');
      fetchMenuAndInventory(); // Refetch
    } catch (err) {
      console.error("Error saving inventory item:", err);
      alert("Error saving inventory item: " + err.response?.data?.message);
    }
  };
  
  // (Unchanged)
  const handleUpdateOrder = async (orderId, status) => {
    try {
      await axios.put(`/api/owner/orders/update/${orderId}`, { status });
      alert(`Order ${orderId} updated to ${status}`);
      fetchOrders(); // Refetch
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Error updating order: " + err.response?.data?.message);
    }
  };
  
  // (Unchanged)
  const handleSubmitComplaint = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const complaintData = {
      subject: formData.get('subject'),
      message: formData.get('message'),
    };
    try {
      await axios.post('/api/owner/complaints/my', complaintData);
      alert('Complaint submitted!');
      event.target.reset();
      fetchComplaints(); // Refetch
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Error submitting complaint: " + err.response?.data?.message);
    }
  };
  
  // (Unchanged)
  const handleDeleteMyComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      // ❗️ Note: Your backend doesn't have a route for this yet.
      // await axios.delete(`/api/owner/complaints/my/${id}`); 
      alert('Complaint deleted! (Mock)'); // Mocking this as the route doesn't exist
      // fetchComplaints(); // Refetch
      setMyComplaints(prev => prev.filter(c => c._id !== id)); // Optimistic update
    } catch (err) {
      console.error("Error deleting complaint:", err);
      alert("Error deleting complaint: " + err.response?.data?.message);
    }
  };
  
  // (Unchanged)
  const handleDeleteNotification = async (id) => {
    try {
      // ❗️ Note: Your backend doesn't have a route for this yet.
      // await axios.delete(`/api/owner/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id)); 
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Error deleting notification: " + err.response?.data?.message);
    }
  };
  
  // (Unchanged)
  const handleClearAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      // ❗️ Note: Your backend doesn't have a route for this yet.
      // await axios.delete('/api/owner/notifications/all');
      setNotifications([]); 
    } catch (err) {
      console.error("Error clearing notifications:", err);
      alert("Error clearing notifications: " + err.response?.data?.message);
    }
  };
  
  // ⭐️ MODIFIED: Switched to FormData for file uploads
  // Removed the 'isImageUpload' logic as the form onSubmit now handles everything.
  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    
    // Create FormData from the form. This will include all text fields
    // AND the file from the 'shopLogo' input.
    const formData = new FormData(event.target);
    
    try {
      // Send FormData. Axios will set the Content-Type.
      await axios.put('/api/owner/profile', formData);
      alert('Profile updated!');
      fetchProfileAndIncome(); // Refetch
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile: " + (err.response?.data?.message || err.message));
    }
  };
  
  // (Unchanged)
  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const passwordData = Object.fromEntries(formData.entries());
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("New passwords do not match!");
    }
    if (!passwordData.newPassword) {
        return alert("Password cannot be blank."); // Or just return silently
    }
    try {
      // ❗️ Note: Your backend doesn't have a route for this yet.
      // await axios.put('/api/owner/profile/password', { newPassword: passwordData.newPassword });
      alert('Password updated! (Mock)');
      event.target.reset();
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Error updating password: " + err.response?.data?.message);
    }
  };
  
  // (Unchanged)
  const handleBankUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const bankData = Object.fromEntries(formData.entries());
    try {
      await axios.put('/api/owner/profile/withdraw', bankData);
      alert('Bank details updated!');
      fetchProfileAndIncome(); // Refetch
    } catch (err) {
      console.error("Error updating bank details:", err);
      alert("Error updating bank details: " + err.response?.data?.message);
    }
  };


  return (
    <>
      <GlobalStyles />
      
      {/* 1. Mobile Navbar */}
      <Navbar bg="white" className="d-md-none shadow-sm" sticky="top">
        <Container fluid>
          <Button variant="link" onClick={() => setShowMobileNav(true)} className="p-0 text-dark">
            <IconList size={32} />
          </Button>
          <Navbar.Brand href="#" className="fw-bold fs-5 mx-auto">
            Owner Dashboard
          </Navbar.Brand>
          <Button variant="link" onClick={handleLogout} className="text-danger p-0">
            <IconBoxArrowLeft size={26} />
          </Button>
        </Container>
      </Navbar>

      <div className="dashboard-layout">
      
        {/* 2. Desktop Sidebar */}
        <div 
          className={`dashboard-sidebar d-none d-md-flex flex-column p-3 bg-dark text-white ${isDesktopCollapsed ? 'collapsed' : ''}`}
        >
          <h2 className="fs-4 fw-bold text-white text-center mb-4" style={{ height: '40px' }}>
            {!isDesktopCollapsed && "Owner Dashboard"}
          </h2>
          <div className="flex-grow-1">
            <DashboardNavMenu 
              isCollapsed={isDesktopCollapsed}
              activeTab={activeTab}
              setActiveTab={setActiveTab} 
            />
          </div>
          <div className="mt-auto">
            <Button
              variant="outline-light"
              className="w-100 mb-2 d-flex align-items-center justify-content-center gap-3"
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            >
              {isDesktopCollapsed ? <IconArrowBarRight size={22} /> : <IconArrowBarLeft size={22} />}
              <span className="nav-text">Collapse</span>
            </Button>
            <Button 
              variant="danger" 
              className="w-100 d-flex align-items-center justify-content-center gap-3" 
              onClick={handleLogout}
            >
              <IconBoxArrowLeft size={22} />
              <span className="nav-text">Log Out</span>
            </Button>
          </div>
        </div>

        {/* 3. Mobile Off-canvas Nav */}
        <Offcanvas 
          show={showMobileNav} 
          onHide={() => setShowMobileNav(false)} 
          className="d-md-none bg-dark text-white"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0 d-flex flex-column">
            <div className="flex-grow-1 p-3">
              <DashboardNavMenu 
                isCollapsed={false} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLinkClick={() => setShowMobileNav(false)} 
              />
            </div>
            <div className="p-3 mt-auto">
              <Button 
                variant="danger" 
                className="w-100 d-flex align-items-center justify-content-center gap-3" 
                onClick={handleLogout}
              >
                <IconBoxArrowLeft size={22} />
                <span className="fw-medium">Log Out</span>
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* 4. Main Content Area */}
        <main 
          className={`dashboard-main p-3 p-md-4 ${isDesktopCollapsed ? 'sidebar-collapsed' : ''}`}
        >
          {/* This div adds spacing for the fixed mobile navbar */}
          <div className="d-md-none" style={{ height: '56px' }}></div> 
          
          <RenderActiveTab 
            activeTab={activeTab} 
            // Pass all states
            menuItems={menuItems}
            inventory={inventory}
            upcomingOrders={upcomingOrders}
            presentOrders={presentOrders}
            customerComplaints={customerComplaints}
            myComplaints={myComplaints}
            notifications={notifications}
            profile={profile}
            incomeData={incomeData}
            // Pass all loading states
            loadingMenu={loadingMenu}
            loadingInventory={loadingInventory}
            loadingOrders={loadingOrders}
            loadingComplaints={loadingComplaints}
            loadingMyComplaints={loadingMyComplaints}
            loadingNotifications={loadingNotifications}
            loadingProfile={loadingProfile}
            loadingIncome={loadingIncome}
            // Pass all handlers
            handleSaveItem={handleSaveItem}
            handleDeleteItem={handleDeleteItem}
            handleSaveInventoryUpdate={handleSaveInventoryUpdate}
            handleSaveAddInventory={handleSaveAddInventory}
            menuSearch={menuSearch}
            setMenuSearch={setMenuSearch}
            inventorySearch={inventorySearch}
            setInventorySearch={setInventorySearch}
            handleUpdateOrder={handleUpdateOrder}
            handleSubmitComplaint={handleSubmitComplaint}
            handleDeleteMyComplaint={handleDeleteMyComplaint}
            handleDeleteNotification={handleDeleteNotification}
            handleClearAllNotifications={handleClearAllNotifications}
            handleProfileUpdate={handleProfileUpdate}
            handleBankUpdate={handleBankUpdate}
            handlePasswordUpdate={handlePasswordUpdate}
          />
        </main>
        
      </div>
    </>
  );
};


export default DashboardLayout;