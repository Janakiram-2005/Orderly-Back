import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDateTime } from '../../utils/helpers' // <-- IMPORT HELPERS

// Mock API Call
const fetchOwnerDetails = (id) => new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      id,
      name: 'John Doe',
      email: 'john@goldenspoon.com',
      phone: '555-1111',
      status: 'Active',
      joinedDate: '2024-01-15T10:30:00Z',
      restaurant: {
        id: 'r1',
        name: 'The Golden Spoon',
        address: '123 Main St, Anytown',
        status: 'Approved',
      },
      orderHistory: [
        { id: 'T_12345', customer: 'Jane Smith', amount: 3500.50, status: 'Completed', date: '2025-11-05T10:00:00Z' },
        { id: 'T_12346', customer: 'Mike Johnson', amount: 8999.00, status: 'Completed', date: '2025-11-04T11:00:00Z' },
        { id: 'T_12347', customer: 'Sarah Lee', amount: 2310.00, status: 'Pending', date: '2025-11-03T12:00:00Z' },
      ]
    })
  }, 500)
})

// (rest of the mock API calls)
const deleteOwner = (id) => new Promise((resolve) => {
  setTimeout(() => {
    console.log(`DELETED OWNER: ${id}`)
    resolve({ success: true })
  }, 500)
})


const OwnerDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch from /api/owner/:id
    fetchOwnerDetails(id).then(data => {
      setOwner(data)
      setLoading(false)
    })
  }, [id])
  
  const handleDelete = async () => {
    if (!window.confirm("DANGER: Are you sure you want to permanently delete this owner and their restaurant? This action cannot be undone.")) return;
    
    // TODO: Call backend /api/owner/:id
    await deleteOwner(id)
    alert('Owner has been deleted.')
    navigate('/owners')
  }

  if (loading) return <Loader />
  if (!owner) return <div className="alert alert-danger">Owner not found.</div>

  return (
    <div>
      <Link to="/owners" className="btn btn-outline-secondary mb-3">
        <i className="bi bi-arrow-left-circle me-2"></i>Back to Owners List
      </Link>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="page-title mb-0">{owner.name}</h1>
        <span className={`badge fs-5 bg-${owner.status === 'Active' ? 'success' : 'danger'}`}>
          {owner.status}
        </span>
      </div>

      <div className="row g-4">
        {/* Left Column: Details */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header"><h5 className="card-title mb-0">Owner Details</h5></div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <strong className="text-muted d-block">Email</strong>
                  <p>{owner.email}</p>
                </div>
                <div className="col-md-6">
                  <strong className="text-muted d-block">Phone</strong>
                  <p>{owner.phone}</p>
                </div>
                 <div className="col-md-6">
                  <strong className="text-muted d-block">Joined Date</strong>
                  <p>{new Date(owner.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header"><h5 className="card-title mb-0">Restaurant: {owner.restaurant.name}</h5></div>
            <div className="card-body">
              <strong className="text-muted d-block">Address</strong>
              <p>{owner.restaurant.address}</p>
              <strong className="text-muted d-block">Status</strong>
              <p>{owner.restaurant.status}</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header"><h5 className="card-title mb-0">Recent Order History (from this restaurant)</h5></div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owner.orderHistory.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        
                        {/* --- THIS IS THE FIX --- */}
                        <td>{formatCurrency(order.amount)}</td>
                        
                        <td>{order.status}</td>
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
                <i className="bi bi-lock-fill me-2"></i>Block Owner
              </button>
              <button className="btn btn-danger w-100" onClick={handleDelete}>
                <i className="bi bi-trash-fill me-2"></i>Delete Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerDetails