import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom' // Import Link
import Loader from '../../components/common/Loader'
import RestaurantDetailView from '../../components/specific/RestaurantDetailView'

// Mock API call
const fetchRestaurantDetails = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 'r1' || id === 'r2' || id === 'r3') {
        resolve({
          id: id,
          shopName: 'The Golden Spoon',
          shopAddress: '123 Main St, Anytown, USA 12345',
          ownerName: 'John Doe',
          email: 'john.doe@goldenspoon.com',
          phone: '+1 (555) 123-4567',
          status: 'Pending',
          // Add paths to mock documents
          documents: [
            { name: 'BusinessLicense.pdf', url: '#' },
            { name: 'HealthCertificate.pdf', url: '#' },
          ]
        })
      } else {
        reject(new Error('Restaurant not found'))
      }
    }, 1000)
  })
}

// Mock API calls for actions
const approveRestaurant = (id) => {
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500))
}
const rejectRestaurant = (id, reason) => {
  return new Promise(resolve => setTimeout(() => resolve({ success: true, reason }), 500))
}


const RestaurantDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    // TODO: Fetch data from /api/restaurant/:id
    setLoading(true)
    fetchRestaurantDetails(id)
      .then(data => setRestaurant(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this restaurant?")) return
    
    setIsSubmitting(true)
    // TODO: Call backend API
    await approveRestaurant(id)
    setIsSubmitting(false)
    // Show success message (e.g., with a toast)
    alert('Restaurant Approved!')
    navigate('/restaurants')
  }

  const handleReject = async () => {
    if (!rejectionReason) {
      alert("Please provide a reason for rejection.");
      return;
    }
    if (!window.confirm("Are you sure you want to reject this restaurant?")) return

    setIsSubmitting(true)
    // TODO: Call backend API
    await rejectRestaurant(id, rejectionReason)
    setIsSubmitting(false)
    // Show success message
    alert(`Restaurant Rejected. Reason: ${rejectionReason}`)
    navigate('/restaurants')
  }

  if (loading) return <Loader />
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      {/* --- THIS IS THE NEW BUTTON --- */}
      <Link to="/restaurants" className="btn btn-outline-secondary mb-3">
        <i className="bi bi-arrow-left-circle me-2"></i>Back to Verification List
      </Link>
      
      <h1 className="page-title">Review Application: {restaurant?.shopName}</h1>
      
      <RestaurantDetailView restaurant={restaurant} />

      <div className="card mt-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Admin Actions</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="rejectionReason" className="form-label">Rejection Reason (if applicable)</label>
            <textarea
              className="form-control"
              id="rejectionReason"
              rows="3"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Missing health certificate."
            ></textarea>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-success btn-lg" 
              onClick={handleApprove} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Approving...' : <><i className="bi bi-check-circle-fill me-2"></i>Approve</>}
            </button>
            <button 
              className="btn btn-danger btn-lg" 
              onClick={handleReject} 
              disabled={isSubmitting || !rejectionReason}
            >
              {isSubmitting ? 'Rejecting...' : <><i className="bi bi-x-circle-fill me-2"></i>Reject</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetails