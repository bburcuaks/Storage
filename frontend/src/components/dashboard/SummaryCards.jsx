import { Package, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import './SummaryCards.css';

const SummaryCards = ({ total, critical, low, sufficient }) => {
  return (
    <div className="summary-cards-container">
      <Card className="summary-card">
        <div className="summary-icon-wrapper blue">
          <Package className="summary-icon" />
        </div>
        <div className="summary-info">
          <span className="summary-label">Total Products</span>
          <h3 className="summary-value">{total}</h3>
        </div>
      </Card>

      <Card className="summary-card">
        <div className="summary-icon-wrapper red">
          <AlertCircle className="summary-icon" />
        </div>
        <div className="summary-info">
          <span className="summary-label">Critical Stock</span>
          <h3 className="summary-value">{critical}</h3>
        </div>
      </Card>

      <Card className="summary-card">
        <div className="summary-icon-wrapper yellow">
          <AlertTriangle className="summary-icon" />
        </div>
        <div className="summary-info">
          <span className="summary-label">Low Stock</span>
          <h3 className="summary-value">{low}</h3>
        </div>
      </Card>

      <Card className="summary-card">
        <div className="summary-icon-wrapper green">
          <CheckCircle2 className="summary-icon" />
        </div>
        <div className="summary-info">
          <span className="summary-label">Sufficient Stock</span>
          <h3 className="summary-value">{sufficient}</h3>
        </div>
      </Card>
    </div>
  );
};

export default SummaryCards;
