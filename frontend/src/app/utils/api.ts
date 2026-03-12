// Get API base URL - use environment variable or default to current origin
export const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  return import.meta.env.VITE_API_URL || window.location.origin;
};

export const apiUrl = (path: string) => {
  return `${getApiBase()}${path}`;
};
