import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'

// Mock API Call
const fetchCustomers = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve([
      { id: 'c1', name: 'Jane Smith', email: 'jane@gmail.com', phone: '555-4444', totalOrders: 15, status: 'Active' },
      { id: 'c2', name: 'Mike Johnson', email: 'mike@yahoo.com', phone: '555-5555', totalOrders: 3, status: 'Active' },
      { id: 'c3', name: 'Sarah Lee', email: 'sarah@hotmail.com', phone: '555-6666', totalOrders: 0, status: 'Blocked' },
    ])
  }, 500)
})

const CustomersList = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // TODO: Fetch from /api/customers
    fetchCustomers().then(data => {
      setCustomers(data)
      setLoading(false)
    })
  }, [])
  
  const handleBlockToggle = (customerId) => {
    if (!window.confirm("Are you sure you want to change this customer's status?")) return;
    
    // TODO: Send this to backend /api/customer/:id/block
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, status: c.status === 'Active' ? 'Blocked' : 'Active' } : c
    ))
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  if (loading) return <Loader />

  return (
    <div>
      <h1 className="page-title">Customers</h1>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">All Customers</h5>
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Orders</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td className="fw-bold">{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.totalOrders}</td>
                    <td>
                      <span className={`badge bg-${customer.status === 'Active' ? 'success' : 'danger'}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/customer/${customer.id}`} className="btn btn-primary btn-sm me-2" title="View Details">
                        <i className="bi bi-eye-fill"></i>
                      </Link>
                      <button 
                        className={`btn btn-sm ${customer.status === 'Active' ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleBlockToggle(customer.id)}
                        title={customer.status === 'Active' ? 'Block Customer' : 'Unblock Customer'}
                      >
                        <i className={`bi ${customer.status === 'Active' ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomersList