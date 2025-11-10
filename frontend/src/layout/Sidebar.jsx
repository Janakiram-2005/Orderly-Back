import { NavLink } from 'react-router-dom'
// Make sure this path is correct for your logo
import myLogo from '../../assets/styles/unnamed (1).jpg' 

const Sidebar = ({ isToggled }) => {
  return (
    <nav className={`sidebar ${isToggled ? 'toggled' : ''}`}>
      
      {/* --- UPDATED HEADER --- */}
      {/* We center the logo and remove the text */}
      <div className="sidebar-header d-flex justify-content-center align-items-center">
        <img 
          src={myLogo} 
          alt="Admin Logo" 
          style={{ height: '140px' , width: '140px'}} // <-- Increased height
        />
        {/* "Admin" text removed from here */}
      </div>
      
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className="nav-link" to="/" end>
            <i className="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/restaurants">
            <i className="bi bi-patch-check-fill"></i>
            <span>Verification</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/owners">
            <i className="bi bi-person-badge"></i>
            <span>Owners</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/customers">
            <i className="bi bi-people-fill"></i>
            <span>Customers</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/complaints">
            <i className="bi bi-chat-left-text-fill"></i>
            <span>Complaints</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/promotions">
            <i className="bi bi-megaphone-fill"></i>
            <span>Promotions</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/feedbacks">
            <i className="bi bi-star-fill"></i>
            <span>Feedbacks</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/settings">
            <i className="bi bi-person-circle"></i>
            <span>Profile Settings</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar