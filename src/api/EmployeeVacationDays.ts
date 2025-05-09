import axios from 'axios';

const API_URL = 'http://localhost:5162/api';

export const getEmployeeVacationDays = async () => {
    const response = await axios.get(`${API_URL}/EmployeeVacationDays`);
    return response.data;
};

export const getEmployeeVacationDay = async (id) => {
    const response = await axios.get(`${API_URL}/EmployeeVacationDays/${id}`);
    return response.data;
};

export const createEmployeeVacationDay = async (employeeVacationDay) => {
    const response = await axios.post(`${API_URL}/EmployeeVacationDays`, employeeVacationDay);
    return response.data;
};

export const updateEmployeeVacationDay = async (id, employeeVacationDay) => {
    const response = await axios.put(`${API_URL}/EmployeeVacationDays/${id}`, employeeVacationDay);
    return response.data;
};

export const deleteEmployeeVacationDay = async (id) => {
    const response = await axios.delete(`${API_URL}/EmployeeVacationDays/${id}`);
    return response.data;
};

export const getEmployeeVacationDaysByDepartment = async (departmentId) => {
    const response = await axios.get(`${API_URL}/EmployeeVacationDays/department/${departmentId}`);
    return response.data;
};