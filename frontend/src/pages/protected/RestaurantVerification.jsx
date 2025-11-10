import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'

// Mock API call
const fetchPendingRestaurants = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'r1', name: 'The Golden Spoon', owner: 'John Doe', submitted: '2025-11-05T14:30:00Z' },
        { id: 'r2', name: 'Pizza Palace', owner: 'Jane Smith', submitted: '2025-11-04T10:15:00Z' },
        { id: 'r3', name: 'Sushi Central', owner: 'Kenji Tanaka', submitted: '2025-11-03T09:00:00Z' },
      ])
    }, 1000)
  })
}


const RestaurantVerification = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch data from /api/restaurants/pending
    setLoading(true)
    fetchPendingRestaurants().then(data => {
      setRestaurants(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <h1 className="page-title">Restaurant Verification</h1>
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Pending Applications</h5>
        </div>
        <div className="card-body">
          {restaurants.length === 0 ? (
            <div className="alert alert-info">No pending applications found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Shop Name</th>
                    <th>Owner Name</th>
                    <th>Submitted On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map(r => (
                    <tr key={r.id}>
                      <td className="fw-bold">{r.name}</td>
                      <td>{r.owner}</td>
                      <td>{new Date(r.submitted).toLocaleString()}</td>
                      <td>
                        <Link to={`/restaurant/${r.id}`} className="btn btn-primary btn-sm">
                          <i className="bi bi-eye-fill me-1"></i> Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RestaurantVerification