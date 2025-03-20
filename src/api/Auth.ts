import axios from 'axios';

const API_URL = 'http://localhost:5162/api/Auth';

export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
    });
    return response.data;
};