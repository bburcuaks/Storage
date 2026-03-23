import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  ChevronDown,
  Check,
  X,
  PackageSearch,
  PlusCircle,
  MinusCircle
} from "lucide-react";

// The URL you modified, we'll ensure it points to the correct endpoint through the proxy
const API_BASE = "/api/product";
const COMPANY_ID = "COMP-001";

const emptyForm = {
  productName: "",
  productCode: "",
  currentStock: "",
  minimumStock: "",
  unit: "",
  category: "",
  description: "",
};

function App() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [sortOption, setSortOption] = useState("name-asc");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}?companyId=${COMPANY_ID}&page=1&pageSize=100`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Ürünler alınamadı.");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.items)) {
        setProducts(data.items);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      alert("Ürünler alınırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product) => {
    if (product.currentStock <= 0) return "Tükendi";
    if (product.currentStock <= product.minimumStock) return "Kritik";
    if (product.currentStock <= product.minimumStock + 5) return "Az";
    return "Yeterli";
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category?.trim() || "Diğer"));
    return Array.from(cats).filter(Boolean).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.productName?.toLowerCase().includes(lowerKeyword) ||
          p.productCode?.toLowerCase().includes(lowerKeyword) ||
          p.category?.toLowerCase().includes(lowerKeyword)
      );
    }

    if (statusFilter) {
      result = result.filter((p) => getStockStatus(p) === statusFilter);
    }

    if (categoryFilter) {
      result = result.filter(
        (p) => (p.category?.trim() || "Diğer") === categoryFilter
      );
    }

    result.sort((a, b) => {
      if (sortOption === "name-asc") {
        return (a.productName || "").localeCompare(b.productName || "");
      }

      if (sortOption === "name-desc") {
        return (b.productName || "").localeCompare(a.productName || "");
      }

      return 0;
    });

    return result;
  }, [products, keyword, statusFilter, categoryFilter, sortOption]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "currentStock" || name === "minimumStock"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProduct(null);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName || "",
      productCode: product.productCode || "",
      currentStock: product.currentStock || 0,
      minimumStock: product.minimumStock || 0,
      unit: product.unit || "",
      category: product.category || "",
      description: product.description || "",
    });
    setShowEditModal(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        companyId: COMPANY_ID,
        productName: formData.productName,
        productCode: formData.productCode,
        currentStock: Number(formData.currentStock),
        minimumStock: Number(formData.minimumStock),
        unit: formData.unit,
        category: formData.category,
        description: formData.description,
      };

      const response = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Ürün eklenemedi.");
      }

      closeModal();
      fetchProducts();
    } catch (error) {
      console.error("Add product error:", error);
      alert("Ürün eklenirken hata oluştu.");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    if (!editingProduct) return;

    try {
      const payload = {
        id: editingProduct.id,
        companyId: editingProduct.companyId || COMPANY_ID,
        productName: formData.productName,
        productCode: formData.productCode,
        currentStock: Number(formData.currentStock),
        minimumStock: Number(formData.minimumStock),
        unit: formData.unit,
        category: formData.category,
        description: formData.description,
      };

      const response = await fetch(`${API_BASE}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Ürün güncellenemedi.");
      }

      closeModal();
      fetchProducts();
    } catch (error) {
      console.error("Edit product error:", error);
      alert("Ürün güncellenirken hata oluştu.");
    }
  };

  const handleDeleteProduct = async (id, e) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Bu ürünü silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          companyId: COMPANY_ID
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Ürün silinemedi.");
      }

      fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Ürün silinirken hata oluştu.");
    }
  };

  const handleAddStock = async (productId, e) => {
    e.stopPropagation();
    const quantity = prompt("Eklenecek miktar:");
    if (!quantity) return;

    try {
      const response = await fetch(`${API_BASE}/add-stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: COMPANY_ID,
          productId: productId,
          quantity: parseInt(quantity),
          note: "Frontend giriş"
        })
      });
      if (!response.ok) throw new Error("Stok eklenemedi");
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Stok ekleme hatası!");
    }
  };

  const handleRemoveStock = async (productId, e) => {
    e.stopPropagation();
    const quantity = prompt("Çıkarılacak miktar:");
    if (!quantity) return;

    try {
      const response = await fetch(`${API_BASE}/remove-stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: COMPANY_ID,
          productId: productId,
          quantity: parseInt(quantity),
          note: "Frontend çıkış"
        })
      });
      if (!response.ok) throw new Error("Stok çıkarılamadı");
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Stok çıkarma hatası!");
    }
  };

  const openHistoryModal = async (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const response = await fetch(`${API_BASE}/stock-history`, {
        method: "POST", /* Backend POST metodunu bekliyor olabilir */
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: COMPANY_ID,
          productId: product.id
        })
      });
      if (!response.ok) throw new Error("Geçmiş alınamadı (HTTP durumu OK değil)");
      
      const data = await response.json();
      console.log("History API Cevabı:", data); // Tarayıcı konsolunda inceleyebilmek için

      // Backend eğer { items: [...] } şeklinde dönüyorsa array'i çıkartalım
      if (Array.isArray(data)) {
        setHistoryData(data);
      } else if (data && Array.isArray(data.items)) {
        setHistoryData(data.items);
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      console.error("History fetch error:", error);
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Tükendi":
        return "color-out";
      case "Kritik":
        return "color-critical";
      case "Az":
        return "color-low";
      case "Yeterli":
        return "color-ok";
      default:
        return "";
    }
  };

  return (
    <div className="trendyol-wrapper">
      <header className="trendyol-header">
        <div className="header-container">
          <div className="logo-section">
            <span className="logo-brand">SportStorage</span>
          </div>

          <div className="search-section">
            <input
              type="text"
              placeholder="Aradığınız ürünü veya kodu yazınız"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" size={20} />
            <button className="search-btn">ARA</button>
          </div>

          <div className="actions-section">
            <button className="add-product-btn" onClick={openAddModal}>
              <Plus size={18} />
              <span>Ürün Ekle</span>
            </button>
          </div>
        </div>
      </header>

      <div className="subheader-container">
        <span>Tüm Ürünler</span>
        <span className="result-count">
          {filteredProducts.length} ürün listeleniyor
        </span>
      </div>

      <div className="main-layout">
        <aside className="filters-sidebar">
          <div className="filter-box">
            <h3 className="filter-title">Durum Filtresi</h3>
            <ul className="filter-list">
              {[
                { label: "Tümü", val: "" },
                { label: "Yeterli Stok", val: "Yeterli" },
                { label: "Azalan Stok", val: "Az" },
                { label: "Kritik Seviye", val: "Kritik" },
                { label: "Tükendi", val: "Tükendi" },
              ].map((opt) => (
                <li
                  key={opt.val}
                  className={statusFilter === opt.val ? "active-filter" : ""}
                  onClick={() => setStatusFilter(opt.val)}
                >
                  <div className="checkbox-box">
                    {statusFilter === opt.val && <Check size={14} />}
                  </div>
                  <span className="filter-label">{opt.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-box">
            <h3 className="filter-title">Kategori</h3>
            <ul className="filter-list">
              <li
                className={categoryFilter === "" ? "active-filter" : ""}
                onClick={() => setCategoryFilter("")}
              >
                <div className="checkbox-box">
                  {categoryFilter === "" && <Check size={14} />}
                </div>
                <span className="filter-label">Tüm Kategoriler</span>
              </li>

              {categories.map((cat) => (
                <li
                  key={cat}
                  className={categoryFilter === cat ? "active-filter" : ""}
                  onClick={() => setCategoryFilter(cat)}
                >
                  <div className="checkbox-box">
                    {categoryFilter === cat && <Check size={14} />}
                  </div>
                  <span className="filter-label">{cat}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="product-catalog">
          <div className="catalog-header">
            <div className="sort-box">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">A'dan Z'ye Sırala</option>
                <option value="name-desc">Z'den A'ya Sırala</option>
              </select>
              <ChevronDown className="select-icon" size={16} />
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid-container">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const status = getStockStatus(product);

                  return (
                    <div 
                      className="product-card" 
                      key={product.id} 
                      onClick={() => openHistoryModal(product)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-image-wrapper">
                        <ImageIcon size={48} className="placeholder-icon" />
                        <div className={`status-pill ${getStatusColor(status)}`}>
                          {status}
                        </div>
                      </div>

                      <div className="card-details">
                        <div className="brand">{product.category || "Diğer"}</div>

                        <div
                          className="product-title"
                          title={product.productName}
                        >
                          {product.productName}
                        </div>

                        <div className="stock-info">
                          <span>Stok:</span>
                          <span
                            className={`stock-amount ${getStatusColor(status)}`}
                          >
                            {product.currentStock} {product.unit || "Adet"}
                          </span>
                        </div>

                        <div className="code-info">
                          Kod: {product.productCode}
                        </div>
                      </div>

                      <div className="hover-actions-overlay">
                        <div className="stock-action-row">
                          <button
                            className="action-btn add-stock"
                            onClick={(e) => handleAddStock(product.id, e)}
                          >
                            <PlusCircle size={16} /> Giriş
                          </button>
                          <button
                            className="action-btn remove-stock"
                            onClick={(e) => handleRemoveStock(product.id, e)}
                          >
                            <MinusCircle size={16} /> Çıkış
                          </button>
                        </div>
                      
                        <button
                          className="action-btn edit"
                          onClick={() => openEditModal(product)}
                        >
                          <Edit2 size={16} /> Düzenle
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={(e) => handleDeleteProduct(product.id, e)}
                        >
                          <Trash2 size={16} /> Sil
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-results">
                  <PackageSearch size={64} className="no-result-icon" />
                  <h3>Aradığınız kriterlere uygun ürün bulunamadı.</h3>
                  <p>Arama kelimesini değiştirmeyi veya filtreleri kaldırmayı deneyin.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {(showAddModal || showEditModal) && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{showAddModal ? "Yeni Ürün Ekle" : "Ürünü Düzenle"}</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={showAddModal ? handleAddProduct : handleEditProduct}
              className="modal-form"
            >
              <div className="form-group-row">
                <div className="input-group">
                  <label>Ürün Adı</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Ürün Kodu</label>
                  <input
                    type="text"
                    name="productCode"
                    value={formData.productCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="input-group">
                  <label>Mevcut Stok</label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Minimum Stok</label>
                  <input
                    type="number"
                    name="minimumStock"
                    value={formData.minimumStock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="input-group">
                  <label>Kategori</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label>Birim (Adet, Kg vb.)</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="input-group textarea-group">
                <label>Açıklama</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-primary">
                  {showAddModal ? "Kaydet" : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistoryModal && selectedProduct && (
        <div className="modal-backdrop">
          <div className="modal-content history-modal-content">
            <div className="modal-header">
              <h2>{selectedProduct.productName} - Stok Geçmişi</h2>
              <button className="close-btn" onClick={() => setShowHistoryModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {historyLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                </div>
              ) : historyData.length > 0 ? (
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>İşlem</th>
                        <th>Miktar</th>
                        <th>Not</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((item, idx) => (
                        <tr key={idx}>
                          <td>{new Date(item.date || item.createdAt).toLocaleString('tr-TR')}</td>
                          <td>
                            <span className={item.quantity > 0 ? 'history-badge in' : 'history-badge out'}>
                              {item.quantity > 0 ? "Giriş" : "Çıkış"}
                            </span>
                          </td>
                          <td className={item.quantity > 0 ? 'color-ok stock-amount' : 'color-critical stock-amount'}>
                            {item.quantity > 0 ? '+' : ''}{item.quantity}
                          </td>
                          <td>{item.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-results" style={{ padding: "40px 20px" }}>
                  <p>Bu ürün için henüz stok geçmişi bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;