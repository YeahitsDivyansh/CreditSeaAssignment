import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('Bad Request:', data.message);
          break;
        case 401:
          console.error('Unauthorized:', data.message);
          break;
        case 404:
          console.error('Not Found:', data.message);
          break;
        case 409:
          console.error('Conflict:', data.message);
          break;
        case 429:
          console.error('Rate Limited:', data.message);
          break;
        case 500:
          console.error('Server Error:', data.message);
          break;
        default:
          console.error('API Error:', data.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const creditReportsAPI = {
  // Upload XML file
  uploadXML: async (file) => {
    const formData = new FormData();
    formData.append('xmlFile', file);
    
    const response = await api.post('/credit-reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Get all credit reports with pagination
  getAllReports: async (params = {}) => {
    const response = await api.get('/credit-reports', { params });
    return response.data;
  },

  // Get credit report by ID
  getReportById: async (id) => {
    const response = await api.get(`/credit-reports/${id}`);
    return response.data;
  },

  // Get credit reports by PAN
  getReportsByPAN: async (pan) => {
    const response = await api.get(`/credit-reports/pan/${pan}`);
    return response.data;
  },

  // Get latest credit report by PAN
  getLatestReportByPAN: async (pan) => {
    const response = await api.get(`/credit-reports/pan/${pan}/latest`);
    return response.data;
  },

  // Delete credit report
  deleteReport: async (id) => {
    const response = await api.delete(`/credit-reports/${id}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
