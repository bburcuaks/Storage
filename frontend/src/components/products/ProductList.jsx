import Table from '../common/Table';
import ProductRow from './ProductRow';

const ProductList = ({ products, isLoading, onEdit, onDelete, onRestore }) => {
  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products found matching your criteria.</div>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Code</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Zone</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <ProductRow 
            key={product.id} 
            product={product} 
            onEdit={onEdit}
            onDelete={onDelete}
            onRestore={onRestore}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default ProductList;
