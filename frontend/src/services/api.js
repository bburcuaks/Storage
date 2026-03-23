import axios from 'axios';

const API_BASE_URL = 'http://localhost:5111/api'; // 🔥 DÜZELT
const COMPANY_ID = 'COMP-001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCompanyId = () => COMPANY_ID;

export default apiClient;