import axios from 'axios';

const API_URL = 'http://localhost:5162/api';

export const getEmployees = async () => {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data;
};

export const getVacationTypes = async () => {
    const response = await axios.get(`${API_URL}/VacationTypes`);
    return response.data;
};

export const createVacationRequest = async (vacationRequest) => {
    const response = await axios.post(`${API_URL}/vacationRequests`, vacationRequest);
    return response.data;
};
