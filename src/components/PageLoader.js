export default function PageLoader({ label = 'Loading...' }) {
  return <div className="page-loader"><div className="spinner-border text-primary" role="status" /><p>{label}</p></div>;
}
