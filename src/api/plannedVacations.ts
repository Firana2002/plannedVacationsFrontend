import axios from 'axios';

const API_URL = 'http://localhost:5162/api';

export const getVacationTypes = async () => {
    const response = await axios.get(`${API_URL}/VacationTypes`);
    return response.data;
};

export const createVacationRequest = async (vacationRequest) => {
    const response = await axios.post(`${API_URL}/PlannedVacations`, vacationRequest);
    return response.data;
};

export const getPlannedVacations = async (id) => {
    const response = await axios.get(`${API_URL}/PlannedVacations`);
    return response.data;
};
