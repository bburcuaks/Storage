import { useState, useEffect, useCallback } from 'react';
import SummaryCards from '../components/dashboard/SummaryCards';
import ProductList from '../components/products/ProductList';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import ProductForm from '../components/products/ProductForm';
import { fetchProducts, createProduct, updateProduct, deleteProduct, restoreProduct } from '../services/productService';
import { fetchEquipmentZones } from '../services/zoneService';
import './Dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [equipmentZones, setEquipmentZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Pagination & Filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [totalPages, setTotalPages] = useState(1);

  // Stats state
  const [stats, setStats] = useState({ total: 0, critical: 0, low: 0, sufficient: 0 });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const zonesResp = await fetchEquipmentZones();
      setEquipmentZones(zonesResp || []);

      const payload = await fetchProducts(currentPage, pageSize, keyword, statusFilter);
      
      const items = payload.items || payload || [];
      const totalCount = payload.totalCount || items.length; // fallback
      
      setProducts(items);
      setTotalPages(Math.ceil(totalCount / pageSize) || 1);

      // Simple stats calculation logically if backend doesn't provide it
      // Based on prompt:
      // Critical: currentStock <= minimumStock
      // Low: currentStock > minimumStock && currentStock <= minimumStock + 5
      // Sufficient: currentStock > minimumStock + 5
      let total = items.length;
      let crit = 0, lo = 0, suff = 0;
      
      items.forEach(p => {
        if (p.currentStock <= p.minimumStock) crit++;
        else if (p.currentStock <= p.minimumStock + 5) lo++;
        else suff++;
      });

      setStats({
        total: totalCount,
        critical: crit,
        low: lo,
        sufficient: suff
      });
      
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, keyword, statusFilter]);

  useEffect(() => {
    // Basic debounce for typing in keyword could be added here, 
    // but we'll fetch on every change for simplicity in this demo or use a search button
    const handler = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(handler);
  }, [loadData]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete product.');
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreProduct(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to restore product.');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Inventory Overview</h2>
        <button className="btn btn-primary" onClick={handleOpenAdd}>+ Add Product</button>
      </div>
      
      {error && (
        <div style={{ backgroundColor: 'var(--status-critical-bg)', color: 'var(--status-critical)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <SummaryCards 
        total={stats.total}
        critical={stats.critical}
        low={stats.low}
        sufficient={stats.sufficient}
      />

      <div className="dashboard-content">
        <div className="card full-width">
          <div className="table-controls">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="input-search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <select 
              className="input-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Critical">Critical</option>
              <option value="Low">Low</option>
              <option value="Sufficient">Sufficient</option>
            </select>
          </div>
          
          <ProductList 
            products={products} 
            isLoading={isLoading} 
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
          
          {!isLoading && products.length > 0 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm 
          initialData={editingProduct}
          equipmentZones={equipmentZones}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

    </div>
  );
};

export default Dashboard;
