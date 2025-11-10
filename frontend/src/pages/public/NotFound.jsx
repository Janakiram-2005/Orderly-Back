import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <p className="fs-3 fw-bold">
          <span className="text-danger">Oops!</span> Page not found.
        </p>
        <p className="lead">
          The page you’re looking for doesn’t exist.
        </p>
        <Link to="/" className="btn btn-primary btn-lg mt-3">
          <i className="bi bi-house-door-fill me-2"></i>
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;