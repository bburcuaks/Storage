import { Edit2, Trash2, RefreshCw } from 'lucide-react';
import Badge from '../common/Badge';

const ProductRow = ({ product, onEdit, onDelete, onRestore }) => {
  const isDeleted = product.isDeleted; // assuming backend might mark this? The prompt says "delete/restore" so probably soft-delete.

  return (
    <tr className={isDeleted ? 'deleted-row' : ''} style={{ opacity: isDeleted ? 0.6 : 1 }}>
      <td>
        <div style={{ fontWeight: 600 }}>{product.productName}</div>
      </td>
      <td>{product.productCode}</td>
      <td>
        <div>{product.currentStock} {product.unit}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min: {product.minimumStock}</div>
      </td>
      <td>{product.category}</td>
      <td>{product.equipmentZoneName}</td>
      <td>
        <Badge status={product.status}>{product.status}</Badge>
      </td>
      <td>
        <div className="action-buttons-group" style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-icon sm" 
            title="Edit"
            onClick={() => onEdit(product)}
            disabled={isDeleted}
          >
            <Edit2 size={16} />
          </button>
          {isDeleted ? (
            <button 
              className="btn-icon sm green" 
              title="Restore"
              onClick={() => onRestore(product.id)}
            >
              <RefreshCw size={16} />
            </button>
          ) : (
            <button 
              className="btn-icon sm red" 
              title="Delete"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
