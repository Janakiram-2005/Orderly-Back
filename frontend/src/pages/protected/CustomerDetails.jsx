import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDateTime } from '../../utils/helpers' // <-- IMPORT HELPERS

// Mock API Call
const fetchCustomerDetails = (id) => new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      id,
      name: 'Jane Smith',
      email: 'jane@gmail.com',
      phone: '555-4444',
      status: 'Active',
      joinedDate: '2024-03-20T14:30:00Z',
      addresses: [
        { id: 'a1', type: 'Home', line: '456 Oak St, Anytown' },
        { id: 'a2', type: 'Work', line: '789 Pine St, Anytown' },
      ],
      purchaseHistory: [
        { id: 'T_12345', restaurant: 'The Golden Spoon', amount: 3500.50, status: 'Completed', date: '2025-11-05T10:00:00Z' },
        { id: 'T_12300', restaurant: 'Pizza Palace', amount: 2500.00, status: 'Completed', date: '2025-11-02T18:20:00Z' },
        { id: 'T_12250', restaurant: 'The Golden Spoon', amount: 3210.00, status: 'Cancelled', date: '2025-10-30T12:00:00Z' },
      ]
    })
  }, 500)
})

// (rest of the mock API calls)
const deleteCustomer = (id) => new Promise((resolve) => {
  setTimeout(() => {
    console.log(`DELETED CUSTOMER: ${id}`)
    resolve({ success: true })
  }, 500)
})


const CustomerDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch from /api/customer/:id
    fetchCustomerDetails(id).then(data => {
      setCustomer(data)
      setLoading(false)
    })
  }, [id])
  
  const handleDelete = async () => {
    if (!window.confirm("DANGER: Are you sure you want to permanently delete this customer?")) return;
    
    // TODO: Call backend /api/customer/:id
    await deleteCustomer(id)
    alert('Customer has been deleted.')
    navigate('/customers')
  }

  if (loading) return <Loader />
  if (!customer) return <div className="alert alert-danger">Customer not found.</div>

  return (
    <div>
      <Link to="/customers" className="btn btn-outline-secondary mb-3">
        <i className="bi bi-arrow-left-circle me-2"></i>Back to Customers List
      </Link>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="page-title mb-0">{customer.name}</h1>
        <span className={`badge fs-5 bg-${customer.status === 'Active' ? 'success' : 'danger'}`}>
          {customer.status}
        </span>
      </div>

      <div className="row g-4">
        {/* Left Column: Details (no changes) */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header"><h5 className="card-title mb-0">Customer Details</h5></div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <strong className="text-muted d-block">Email</strong>
                  <p>{customer.email}</p>
                </div>
                <div className="col-md-6">
                  <strong className="text-muted d-block">Phone</strong>
                  <p>{customer.phone}</p>
                </div>
                 <div className="col-md-6">
                  <strong className="text-muted d-block">Joined Date</strong>
                  <p>{new Date(customer.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header"><h5 className="card-title mb-0">Saved Addresses</h5></div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {customer.addresses.map(addr => (
                  <li className="list-group-item" key={addr.id}>
                    <strong className="me-2">{addr.type}:</strong> {addr.line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header"><h5 className="card-title mb-0">Purchase History</h5></div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Restaurant</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.purchaseHistory.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.restaurant}</td>
                        
                        {/* --- THIS IS THE FIX --- */}
                        <td>{formatCurrency(order.amount)}</td>
                        
                        <td>
                          <span className={`badge bg-${order.status === 'Completed' ? 'success' : 'secondary'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{formatDateTime(order.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Admin Actions (no changes) */}
        <div className="col-lg-4">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white"><h5 className="card-title mb-0">Admin Actions</h5></div>
            <div className="card-body">
              <p>Be careful with these actions.</p>
              <button className="btn btn-warning w-100 mb-2">
                <i className="bi bi-lock-fill me-2"></i>Block Customer
              </button>
              <button className="btn btn-danger w-100" onClick={handleDelete}>
                <i className="bi bi-trash-fill me-2"></i>Delete Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetails