import axios from 'axios';

// Create an Axios instance pointing to your Express server
const API = axios.create({
  baseURL: '/api', 
});

// Interceptor to attach the JWT token to headers if the user is logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;