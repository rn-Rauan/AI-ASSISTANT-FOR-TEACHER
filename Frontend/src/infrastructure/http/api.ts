import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.31.39:3131',

  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180000, // 3 minutos - Necessário para geração de conteúdos via IA
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro da API (status 4xx ou 5xx)
      console.error('[API Error]', error.response.status, error.response.data);
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('[API Error] Sem resposta do servidor');
    } else {
      // Erro ao configurar a requisição
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;