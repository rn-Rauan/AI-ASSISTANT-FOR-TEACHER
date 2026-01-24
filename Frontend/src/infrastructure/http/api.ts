import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.31.39:3131',

  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180000,
});

export default api;