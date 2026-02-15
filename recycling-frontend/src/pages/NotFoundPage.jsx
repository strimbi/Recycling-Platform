import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="card">
      <h2>Page not found</h2>
      <p className="muted">Try going back to the map.</p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-block' }}>Go to map</Link>
    </div>
  );
}
