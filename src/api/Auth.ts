import axios from 'axios';

const API_URL = 'http://localhost:5162/api/Auth';

export const registerUser = async (email, password, role, employeeId) => {
    const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        role,
        employeeId,
    });
    return response.data;
};

export const loginUser = async (email, password, role, employeeId) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        role,
        employeeId,
    });
    return response.data;
};