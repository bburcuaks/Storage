import { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ initialData, equipmentZones, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productCode: '',
    currentStock: 0,
    minimumStock: 0,
    unit: 'pcs',
    category: '',
    description: '',
    equipmentZoneId: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName || '',
        productCode: initialData.productCode || '',
        currentStock: initialData.currentStock || 0,
        minimumStock: initialData.minimumStock || 0,
        unit: initialData.unit || 'pcs',
        category: initialData.category || '',
        description: initialData.description || '',
        equipmentZoneId: initialData.equipmentZoneId || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentStock' || name === 'minimumStock' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="productName">Product Name *</label>
          <input 
            type="text" 
            id="productName" 
            name="productName" 
            className="input-field" 
            required 
            value={formData.productName} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="productCode">Product Code *</label>
          <input 
            type="text" 
            id="productCode" 
            name="productCode" 
            className="input-field" 
            required 
            value={formData.productCode} 
            onChange={handleChange} 
            disabled={!!initialData} /* usually code is disabled on edit */
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <input 
            type="text" 
            id="category" 
            name="category" 
            className="input-field" 
            required 
            value={formData.category} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="equipmentZoneId">Equipment Zone *</label>
          <select 
            id="equipmentZoneId" 
            name="equipmentZoneId" 
            className="input-field" 
            required 
            value={formData.equipmentZoneId} 
            onChange={handleChange}
          >
            <option value="" disabled>Select Zone</option>
            {equipmentZones.map(zone => (
              <option key={zone.id} value={zone.id}>{zone.zoneName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="currentStock">Current Stock *</label>
          <input 
            type="number" 
            id="currentStock" 
            name="currentStock" 
            className="input-field" 
            required 
            min="0"
            value={formData.currentStock} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="minimumStock">Minimum Stock *</label>
          <input 
            type="number" 
            id="minimumStock" 
            name="minimumStock" 
            className="input-field" 
            required 
            min="0"
            value={formData.minimumStock} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="unit">Unit</label>
          <input 
            type="text" 
            id="unit" 
            name="unit" 
            className="input-field" 
            value={formData.unit} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea 
          id="description" 
          name="description" 
          className="input-field" 
          rows="3"
          value={formData.description} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : (initialData ? 'Update Product' : 'Add Product')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
