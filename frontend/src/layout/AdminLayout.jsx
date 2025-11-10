import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar' // <-- Fixed: Added .jsx
import Header from './Header'    // <-- Fixed: Added .jsx

const AdminLayout = () => {
  const [sidebarToggled, setSidebarToggled] = useState(false)

  const toggleSidebar = () => {
    setSidebarToggled(!sidebarToggled)
  }

  return (
    <div className={`page-wrapper`}>
      <Sidebar isToggled={sidebarToggled} />
      <div className="main-content">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="page-content">
          <Outlet /> {/* This is where your page components will render */}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout