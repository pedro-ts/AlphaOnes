import axios from "axios";

const axiosClient = axios.create({
  // Importando variavel do .env, caso ocorra algum erro verificar se o .env está criado e não só o .env.example existe
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Autenticação adicionada automaticamente em todos requests
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// Garante resposta ou concluida ou de erro previsivel de acordo com seu status, em aplicações maiores preparar uma resposta para quase todos status_code disponiveis e existentes
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response.status == 401) {
      localStorage.removeItem("ACCESS_TOKEN");
    }

    throw error;
  }
);

export default axiosClient;
