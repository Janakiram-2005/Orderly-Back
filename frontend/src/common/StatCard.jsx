const StatCard = ({ title, value, icon, color, change }) => {
  const textClass = `text-${color}`
  const iconClass = `bi ${icon} ${textClass}`
  
  // Logic for the change badge
  let changeClass = `bg-${color}-soft ${textClass}`
  let changeContent = change

  // If the change isn't a "View" or similar text, add an icon
  if (change.startsWith('+')) {
    changeContent = <><i className="bi bi-arrow-up-short"></i> {change}</>
  } else if (change.startsWith('-')) {
    changeClass = `bg-danger-soft text-danger` // Make decreases red
    changeContent = <><i className="bi bi-arrow-down-short"></i> {change}</>
  }

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="card-subtitle text-muted text-uppercase fw-semibold" style={{ fontSize: '0.8rem' }}>{title}</h6>
            <h2 className="card-title fw-bold my-2">{value}</h2>
            <span className={`badge ${changeClass} fw-medium`}>
              {changeContent}
            </span>
          </div>
          <div className={`fs-1 ${textClass} opacity-75`}>
            <i className={iconClass}></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard;