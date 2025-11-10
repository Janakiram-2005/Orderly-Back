import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'

// Mock API Call
const fetchOwners = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve([
      { id: 'o1', name: 'John Doe', restaurant: 'The Golden Spoon', email: 'john@goldenspoon.com', phone: '555-1111', status: 'Active' },
      { id: 'o2', name: 'Jane Smith', restaurant: 'Pizza Palace', email: 'jane@pizzapalace.com', phone: '555-2222', status: 'Active' },
      { id: 'o3', name: 'Kenji Tanaka', restaurant: 'Sushi Central', email: 'kenji@sushi.com', phone: '555-3333', status: 'Blocked' },
    ])
  }, 500)
})

const OwnersList = () => {
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // TODO: Fetch from /api/owners
    fetchOwners().then(data => {
      setOwners(data)
      setLoading(false)
    })
  }, [])
  
  const handleBlockToggle = (ownerId) => {
    if (!window.confirm("Are you sure you want to change this owner's status?")) return;
    
    // TODO: Send this to backend /api/owner/:id/block
    setOwners(owners.map(o => 
      o.id === ownerId ? { ...o, status: o.status === 'Active' ? 'Blocked' : 'Active' } : o
    ))
  }

  const filteredOwners = owners.filter(o =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  if (loading) return <Loader />

  return (
    <div>
      <h1 className="page-title">Restaurant Owners</h1>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">All Owners</h5>
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, restaurant, or email..."
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
                  <th>Restaurant</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwners.map(owner => (
                  <tr key={owner.id}>
                    <td className="fw-bold">{owner.name}</td>
                    <td>{owner.restaurant}</td>
                    <td>{owner.email}</td>
                    <td>
                      <span className={`badge bg-${owner.status === 'Active' ? 'success' : 'danger'}`}>
                        {owner.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/owner/${owner.id}`} className="btn btn-primary btn-sm me-2" title="View Details">
                        <i className="bi bi-eye-fill"></i>
                      </Link>
                      <button 
                        className={`btn btn-sm ${owner.status === 'Active' ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleBlockToggle(owner.id)}
                        title={owner.status === 'Active' ? 'Block Owner' : 'Unblock Owner'}
                      >
                        <i className={`bi ${owner.status === 'Active' ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
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

export default OwnersList