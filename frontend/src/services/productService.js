import apiClient, { getCompanyId } from './api';

// 🔹 GET ALL (filtre + pagination)
export const fetchProducts = async (page = 1, pageSize = 10, keyword = '', status = '') => {
  const companyId = getCompanyId();

  const params = new URLSearchParams({
    companyId,
    page: page.toString(),
    pageSize: pageSize.toString(),
    keyword,
    status: status === 'All' ? '' : status
  });

  const response = await apiClient.get(`/product?${params.toString()}`);
  return response.data;
};

// 🔹 GET BY ID
export const fetchProductById = async (id) => {
  const companyId = getCompanyId();
  const response = await apiClient.get(`/product/${id}?companyId=${companyId}`);
  return response.data;
};

// 🔹 CREATE (🔥 EN ÖNEMLİ FIX)
export const createProduct = async (productData) => {
  const response = await apiClient.post(`/product/create`, {
    ...productData,
    companyId: getCompanyId()
  });
  return response.data;
};

// 🔹 UPDATE
export const updateProduct = async (productData) => {
  const response = await apiClient.post(`/product/update`, productData);
  return response.data;
};

// 🔹 DELETE
export const deleteProduct = async (id) => {
  const response = await apiClient.post(`/product/delete`, {
    id,
    companyId: getCompanyId()
  });
  return response.data;
};