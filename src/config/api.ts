// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Remove trailing slash if present
const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');

export const API_ENDPOINTS = {
  TASKS: `${cleanBaseUrl}/api/tasks`,
  MANPOWER: `${cleanBaseUrl}/api/manpower`,
  AUTH: `${cleanBaseUrl}/api/token`,
  USERS: `${cleanBaseUrl}/api/users`,
} as const;

export default API_BASE_URL; 