import axios from 'axios';

// HINT: define interceptors but it's not needed for now
export const initAxios = () => {
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.baseURL = import.meta.env.VITE_API_ROOT_URL;
};

