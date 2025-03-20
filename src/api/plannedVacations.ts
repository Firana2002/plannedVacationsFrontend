import axios from 'axios';

const API_URL = 'http://localhost:5162/api';

export const getVacationTypes = async () => {
    const response = await axios.get(`${API_URL}/VacationTypes`);
    return response.data;
};

export const createVacationRequest = async (vacationRequest) => {
    const response = await axios.post(`${API_URL}/PlannedVacation`, vacationRequest);
    return response.data;
};

export const getPlannedVacations = async (id) => {
    const response = await axios.get(`${API_URL}/PlannedVacation`);
    return response.data;
};

export const getMyPlannedVacations = async (id) => {
    const response = await axios.get(`${API_URL}/PlannedVacation/my`);
    return response.data;
};

export const updateVacationStatus = async (id, vacationStatusId, comment) => {
    const response = await axios.put(`${API_URL}/PlannedVacation/${id}/status`, {
        vacationStatusId,
        comment
    });
    return response.data;
};