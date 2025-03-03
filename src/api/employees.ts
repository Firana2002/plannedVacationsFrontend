import axios from 'axios';

const API_URL = 'http://localhost:5162/api/employees';

export const getEmployees = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getEmployee = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createEmployee = async (employee) => {
    const response = await axios.post(API_URL, employee);
    return response.data;
};

export const updateEmployee = async (id, employee) => {
    await axios.put(`${API_URL}/${id}`, employee);
};

export const deleteEmployee = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
