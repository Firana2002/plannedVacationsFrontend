import axios from 'axios';

const API_URL = 'http://localhost:5162/api';

export const getVacationTypes = async () => {
    try {
        const response = await axios.get(`${API_URL}/VacationTypes`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Ошибка при получении типов отпуска' };
    }
};

export const createVacationRequest = async (vacationRequest) => {
    try {
        const response = await axios.post(`${API_URL}/PlannedVacation`, vacationRequest);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Ошибка при создании заявки на отпуск' };
    }
};

export const getPlannedVacations = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/PlannedVacation`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Ошибка при получении запланированных отпусков' };
    }
};

export const getMyPlannedVacations = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/PlannedVacation/my`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Ошибка при получении ваших запланированных отпусков' };
    }
};

export const updateVacationStatus = async (id, vacationStatusId, comment) => {
    try {
        const response = await axios.put(`${API_URL}/PlannedVacation/${id}/status`, {
            vacationStatusId,
            comment
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Ошибка при обновлении статуса отпуска' };
    }
};