import './Badge.css';

const Badge = ({ status, children }) => {
  // status: 'critical', 'low', 'sufficient'
  return (
    <span className={`badge-pill status-${status.toLowerCase()}`}>
      {children || status}
    </span>
  );
};

export default Badge;
