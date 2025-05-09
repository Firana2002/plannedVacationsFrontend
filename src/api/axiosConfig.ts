import axios from 'axios';
import Cookies from 'js-cookie';

// Настройка базового URL
axios.defaults.baseURL = 'http://localhost:5162/api';

// Добавляем перехватчик для добавления токена в заголовки
axios.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios; 