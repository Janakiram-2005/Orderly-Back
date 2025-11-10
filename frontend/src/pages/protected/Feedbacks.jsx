import { useState, useEffect } from 'react'

const mockFeedbacks = [
    { id: 'f1', user: 'customer1@gmail.com', rating: 5, comment: 'Amazing service! So fast.', date: '2025-11-05T10:00:00Z' },
    { id: 'f2', user: 'customer2@gmail.com', rating: 3, comment: 'The app is a bit slow on my phone.', date: '2025-11-04T11:00:00Z' },
    { id: 'f3', user: 'owner@pizzapalace.com', rating: 4, comment: 'The new order system is good, but could use a "quick accept" button.', date: '2025-11-03T12:00:00Z' },
]

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <i 
        key={i} 
        className={`bi bi-star-fill ${i <= rating ? 'text-warning' : 'text-light'}`}
      ></i>
    )
  }
  return <div>{stars}</div>
}

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks)
  
  // TODO: Fetch data from /api/feedbacks
  useEffect(() => {
    //
  }, [])

  return (
    <div>
      <h1 className="page-title">Feedbacks</h1>
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">All User Feedbacks</h5>
        </div>
        <div className="card-body">
          {feedbacks.map(fb => (
            <div className="card mb-3" key={fb.id}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 fw-bold">{fb.user}</h6>
                    <StarRating rating={fb.rating} />
                  </div>
                  <small className="text-muted">{new Date(fb.date).toLocaleString()}</small>
                </div>
                <p className="card-text mt-3">{fb.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feedbacks