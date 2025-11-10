import { useState, useRef, useEffect } from 'react' // <-- Import useRef and useEffect
import { useAuth } from '../../contexts/AuthContext'

const ProfileSettings = () => {
  const { user } = useAuth()
  
  // --- NEW CODE ---
  // State to hold the actual file for upload
  const [photoFile, setPhotoFile] = useState(null) 
  // State to hold the temporary URL for the image preview
  const [photoPreview, setPhotoPreview] = useState(null)
  // A ref to access the hidden file input
  const fileInputRef = useRef(null) 
  // --- END NEW CODE ---

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  
  // --- NEW: Clean up the photo preview to prevent memory leaks ---
  useEffect(() => {
    // This function will run when the component unmounts
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview]) // Re-run if photoPreview changes

  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }
  
  const handleInfoSubmit = (e) => {
    e.preventDefault();
    // TODO: Call /api/admin/profile with formData
    
    // --- UPDATED: Check if a new photo was selected ---
    if (photoFile) {
      // In a real app, you would send 'photoFile' to your backend here
      console.log('Uploading new photo:', photoFile)
      alert(`Profile updated! (Mock)\nNew photo selected: ${photoFile.name}`)
    } else {
      alert('Profile updated! (Mock)')
    }
  }
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if(passwordData.new !== passwordData.confirm) {
      alert("New passwords don't match!")
      return
    }
    // TODO: Call /api/admin/change-password
    alert('Password changed! (Mock)')
    setPasswordData({ current: '', new: '', confirm: '' })
  }
  
  // --- NEW: This function triggers the hidden file input ---
  const handleChangePhotoClick = () => {
    fileInputRef.current.click()
  }
  
  // --- NEW: This function runs when the user selects a file ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // 1. Store the file object for the backend
      setPhotoFile(file)
      
      // 2. Create a temporary URL for the preview
      // Revoke the old one if it exists
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div>
      <h1 className="page-title">Profile Settings</h1>
      
      <div className="row g-4">
        {/* Profile Details */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h5 className="card-title mb-0">My Details</h5></div>
            <div className="card-body">
              <div className="text-center mb-4">
                
                {/* --- UPDATED: The image now shows the preview --- */}
                <img 
                  src={photoPreview || user?.avatar} 
                  alt="Admin Avatar" 
                  className="rounded-circle mb-3" 
                  width="120" 
                  height="120"
                  style={{ objectFit: 'cover' }} // Ensures the image looks good
                />
                
                {/* --- UPDATED: The button now triggers our function --- */}
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleChangePhotoClick}
                >
                  Change Photo
                </button>
                
                {/* --- NEW: The hidden file input --- */}
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/gif" // Only allow images
                />
                
              </div>
              <form onSubmit={handleInfoSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInfoChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInfoChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Change Password */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h5 className="card-title mb-0">Change Password</h5></div>
            <div className="card-body">
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="current"
                    value={passwordData.current}
                    onChange={handlePasswordChange}
                  />
                </div>
                 <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="new"
                    value={passwordData.new}
                    onChange={handlePasswordChange}
                  />
                </div>
                 <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="confirm"
                    value={passwordData.confirm}
                    onChange={handlePasswordChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Change Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings