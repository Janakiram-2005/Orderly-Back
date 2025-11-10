import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Header = ({ onToggleSidebar }) => {
  const { user } = useAuth() // <-- Removed 'logout'

  return (
    <header className="header">
      {/* Mobile Toggler */}
      <button
        className="btn btn-link d-lg-none p-0 me-3"
        type="button"
        onClick={onToggleSidebar}
      >
        <i className="bi bi-list fs-3"></i>
      </button>

      {/* Admin Title */}
      <h4 className="m-0 fw-bold text-primary d-none d-lg-block flex-grow-1 text-center">
        Admin
      </h4>

      {/* Header Right Side */}
      <div className="ms-auto d-flex align-items-center">
        {/* Notifications */}
        <div className="dropdown">
          <button
            className="btn btn-link text-secondary"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-bell-fill fs-5"></i>
            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6em' }}>
              3+
            </span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2">
            <li><h6 className="dropdown-header">Notifications</h6></li>
            <li><a className="dropdown-item" href="#">New order received</a></li>
            <li><a className="dropdown-item" href="#">Complaint filed</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-center" href="#">View all</a></li>
          </ul>
        </div>

        {/* User Menu */}
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-decoration-none dropdown-toggle ms-3"
            data-bs-toggle="dropdown"
          >
            <img
              src={user?.avatar || 'https://i.pravatar.cc/150'}
              alt="user"
              width="40"
              height="40"
              className="rounded-circle"
            />
            <div className="d-none d-md-flex flex-column ms-2 text-start">
              <span className="fw-bold text-dark">{user?.name}</span>
              <small className="text-muted">{user?.email}</small>
            </div>
          </a>
          <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2">
            <li><Link className="dropdown-item" to="/settings"><i className="bi bi-gear-fill me-2"></i>Settings</Link></li>
            
            {/* --- REMOVED 'Sign out' BUTTON --- */}
            
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header