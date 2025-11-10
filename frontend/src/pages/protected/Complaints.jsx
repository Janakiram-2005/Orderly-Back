import { useState, useEffect } from 'react'
import ComplaintReplyModal from '../../components/specific/ComplaintReplyModal'

// Mock data
const mockComplaints = [
  { id: 'c1', user: 'customer@gmail.com', type: 'Customer', subject: 'Late Delivery', status: 'Pending', date: '2025-11-05T10:00:00Z' },
  { id: 'c2', user: 'owner@pizzapalace.com', type: 'Owner', subject: 'Payment Issue', status: 'Pending', date: '2025-11-04T11:00:00Z' },
  { id: 'c3', user: 'another@customer.com', type: 'Customer', subject: 'Missing Item', status: 'Resolved', date: '2025-11-03T12:00:00Z' },
]

const Complaints = () => {
  const [complaints, setComplaints] = useState(mockComplaints)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // TODO: Fetch data from /api/complaints
  useEffect(() => {
    //
  }, [])

  const filteredComplaints = complaints.filter(c =>
    c.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleReplyClick = (complaint) => {
    setSelectedComplaint(complaint)
    setShowModal(true)
  }
  
  const handleModalClose = () => {
    setShowModal(false)
    setSelectedComplaint(null)
  }
  
  const handleSendReply = (replyText) => {
    // TODO: Send reply to /api/complaints/reply
    console.log(`Sending reply to ${selectedComplaint.user}: ${replyText}`)
    // Mark as resolved in UI (or refetch)
    setComplaints(complaints.map(c => 
      c.id === selectedComplaint.id ? { ...c, status: 'Resolved' } : c
    ))
    handleModalClose()
    alert('Reply sent!')
  }

  return (
    <div>
      <h1 className="page-title">Review Complaints</h1>
      
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">All Tickets</h5>
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by email or subject..."
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
                  <th>User Email</th>
                  <th>User Type</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(c => (
                  <tr key={c.id}>
                    <td className="fw-bold">{c.user}</td>
                    <td><span className={`badge bg-${c.type === 'Customer' ? 'info' : 'secondary'}`}>{c.type}</span></td>
                    <td>{c.subject}</td>
                    <td>{new Date(c.date).toLocaleString()}</td>
                    <td><span className={`badge bg-${c.status === 'Pending' ? 'warning' : 'success'}`}>{c.status}</span></td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleReplyClick(c)}
                        disabled={c.status === 'Resolved'}
                      >
                        <i className="bi bi-reply-fill me-1"></i> Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Reply Modal */}
      <ComplaintReplyModal
        show={showModal}
        handleClose={handleModalClose}
        complaint={selectedComplaint}
        onSendReply={handleSendReply}
      />
    </div>
  )
}

export default Complaints