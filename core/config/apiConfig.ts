/**
 * API Configuration - Centralized API setup and endpoints
 */

export const API_CONFIG = {
  // Add your API endpoints below
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  
  ENDPOINTS: {
    RECIPES: '/recipes',
    RECOMMENDATIONS: '/recommendations',
    SEARCH: '/search',
  },
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 seconds
  
  // API Keys (use environment variables in production)
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || '',
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

/**
 * Get API endpoint URL
 */
export const getEndpoint = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
