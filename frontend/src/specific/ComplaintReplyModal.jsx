import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const ComplaintReplyModal = ({ show, handleClose, complaint, onSendReply }) => {
  const [replyText, setReplyText] = useState('')

  const handleSubmit = () => {
    if (!replyText) return
    onSendReply(replyText)
    setReplyText('')
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Reply to Complaint: {complaint?.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h6 className="fw-bold">User:</h6>
          <p>{complaint?.user}</p>
        </div>
        <div className="mb-3">
          <h6 className="fw-bold">Subject:</h6>
          <p>{complaint?.subject}</p>
        </div>
        <hr />
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Your Reply:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder={`Hi ${complaint?.user.split('@')[0]},\n\nWe are sorry to hear about...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!replyText}>
          <i className="bi bi-send-fill me-2"></i>Send Reply
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ComplaintReplyModal