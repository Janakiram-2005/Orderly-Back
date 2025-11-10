import { useState, useEffect } from 'react'
import Loader from '../../components/common/Loader'

// --- Mock Data ---
// In a real app, you'd fetch this from your API.
const mockRestaurants = [
  { id: 'r1', name: 'The Golden Spoon' },
  { id: 'r2', name: 'Pizza Palace' },
  { id: 'r3', name: 'Sushi Central' },
  { id: 'r4', name: 'Daily Groceries' },
]

const initialMockPromotions = [
    { id: 'p1', code: 'WINTER25', description: '25% off all orders', status: 'Active', restaurantName: 'All Restaurants' },
    { id: 'p2', code: 'PIZZAPALACE20', description: '20% off Pizza Palace', status: 'Active', restaurantName: 'Pizza Palace' },
    { id: 'p3', code: 'SUSHIFREE', description: 'Free drink at Sushi Central', status: 'Active', restaurantName: 'Sushi Central' },
    { id: 'p4', code: 'SUMMER50', description: '50% off (max $10)', status: 'Expired', restaurantName: 'All Restaurants' },
]

// --- Component ---

const Promotions = () => {
  const [promotions, setPromotions] = useState(initialMockPromotions)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [newPromo, setNewPromo] = useState({
    code: '',
    description: '',
    type: 'percent',
    value: '',
    restaurantId: 'global' // 'global' for "All Restaurants"
  })

  // TODO: Fetch data from /api/promotions and /api/restaurants
  useEffect(() => {
    // Simulating API call
    setLoading(true)
    setTimeout(() => {
      setRestaurants(mockRestaurants)
      setPromotions(initialMockPromotions)
      setLoading(false)
    }, 500) // Simulate a half-second load
  }, [])

  // Handle changes in the new promo form
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setNewPromo(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newPromo.code || !newPromo.description) {
      alert('Please fill in at least a code and description.')
      return
    }

    // TODO: Send `newPromo` state to your backend API
    
    // --- Mocking the frontend update ---
    // Find the restaurant name from the selected ID
    const restaurantName = newPromo.restaurantId === 'global' 
      ? 'All Restaurants' 
      : restaurants.find(r => r.id === newPromo.restaurantId)?.name || 'Unknown Restaurant'

    const createdPromo = {
      id: `p${promotions.length + 10}`, // create a unique-ish ID
      code: newPromo.code,
      description: newPromo.description,
      status: 'Active',
      restaurantName: restaurantName
    }
    
    // Add the new promo to the top of the list
    setPromotions([createdPromo, ...promotions])
    
    // Reset the form
    setNewPromo({
      code: '',
      description: '',
      type: 'percent',
      value: '',
      restaurantId: 'global'
    })
    
    alert('New promotion created successfully!')
  }
  
  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <h1 className="page-title">Promotion Strategies</h1>
      
      <div className="row g-4">
        {/* Left Side: Create New Promotion */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Create New Promotion</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                
                {/* --- NEW: Select Restaurant --- */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Select Restaurant</label>
                  <select 
                    className="form-select"
                    name="restaurantId"
                    value={newPromo.restaurantId}
                    onChange={handleFormChange}
                  >
                    <option value="global">All Restaurants (Global)</option>
                    {restaurants.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Promo Code</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., FREEDELIVERY"
                    name="code"
                    value={newPromo.code}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="e.g., Free delivery on orders over $50"
                    name="description"
                    value={newPromo.description}
                    onChange={handleFormChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Discount Type</label>
                  <select 
                    className="form-select"
                    name="type"
                    value={newPromo.type}
                    onChange={handleFormChange}
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                    <option value="delivery">Free Delivery</option>
                  </select>
                </div>
                 <div className="mb-3">
                  <label className="form-label">Discount Value</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g., 25"
                    name="value"
                    value={newPromo.value}
                    onChange={handleFormChange}
                    disabled={newPromo.type === 'delivery'} // Disable if "Free Delivery"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-plus-circle-fill me-2"></i>Create Promo
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Right Side: Active Promotions */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Active Promotions</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Applies To</th> {/* <-- NEW COLUMN */}
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.map(p => (
                      <tr key={p.id}>
                        <td className="fw-bold">{p.code}</td>
                        <td>{p.description}</td>
                        <td>
                          {/* --- NEW: Show Restaurant Name --- */}
                          <span className={`badge ${
                            p.restaurantName === 'All Restaurants' 
                            ? 'bg-secondary' 
                            : 'bg-info text-dark'
                          }`}>
                            {p.restaurantName}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${p.status === 'Active' ? 'success' : 'secondary'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-outline-primary btn-sm me-2" title="Edit">
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="btn btn-outline-danger btn-sm" title="Deactivate">
                            <i className="bi bi-trash-fill"></i>
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
      </div>
    </div>
  )
}

export default Promotions