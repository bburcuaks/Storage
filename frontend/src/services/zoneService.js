import apiClient from './api';

export const fetchEquipmentZones = async () => {
  const response = await apiClient.get('/equipmentzone');
  return response.data;
};
