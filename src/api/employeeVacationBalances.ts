import axios from 'axios';

const API_URL = 'http://localhost:5172/api/employeeVacationBalances';

export const getEmployeeVacationBalances = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getEmployeeVacationBalance = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createEmployeeVacationBalance = async (balance) => {
    const response = await axios.post(API_URL, balance);
    return response.data;
};

export const updateEmployeeVacationBalance = async (id, balance) => {
    await axios.put(`${API_URL}/${id}`, balance);
};

export const deleteEmployeeVacationBalance = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
