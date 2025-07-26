// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/api/tasks`,
  MANPOWER: `${API_BASE_URL}/api/manpower`,
  AUTH: `${API_BASE_URL}/api/token`,
  USERS: `${API_BASE_URL}/api/users`,
} as const;

export default API_BASE_URL; 