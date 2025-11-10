const RestaurantDetailView = ({ restaurant }) => {
  if (!restaurant) return null
  
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Application Details</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <strong className="text-muted d-block">Shop Name</strong>
            <span className="fs-5">{restaurant.shopName}</span>
          </div>
          <div className="col-md-6">
            <strong className="text-muted d-block">Owner Name</strong>
            <span className="fs-5">{restaurant.ownerName}</span>
          </div>
          <div className="col-md-12">
            <strong className="text-muted d-block">Shop Address</strong>
            <span className="fs-5">{restaurant.shopAddress}</span>
          </div>
          <div className="col-md-6">
            <strong className="text-muted d-block">Owner Email</strong>
            <span className="fs-5">{restaurant.email}</span>
          </div>
          <div className="col-md-6">
            <strong className="text-muted d-block">Owner Phone</strong>
            <span className="fs-5">{restaurant.phone}</span>
          </div>
          <div className="col-md-12">
            <strong className="text-muted d-block">Submitted Documents</strong>
            <ul className="list-group list-group-flush">
              {restaurant.documents.map(doc => (
                <li className="list-group-item" key={doc.name}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-file-earmark-pdf-fill me-2 text-danger"></i>
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetailView