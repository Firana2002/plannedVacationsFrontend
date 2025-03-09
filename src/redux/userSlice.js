import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        loading: false,
        error: null,
    },
    reducers: {
        fetchUserDataStart(state) {
            state.loading = true; // Устанавливаем состояние загрузки
            state.error = null; // Сбрасываем ошибку
        },
        fetchUserDataSuccess(state, action) {
            state.loading = false; // Устанавливаем состояние загрузки в false
            state.userData = action.payload; // Сохраняем данные о пользователе
        },
        fetchUserDataFailure(state, action) {
            state.loading = false; // Устанавливаем состояние загрузки в false
            state.error = action.payload; // Сохраняем ошибку
        },
        clearUserData(state) {
            state.userData = null; // Очищаем данные о пользователе
        },
    },
});

// Экспортируем действия
export const {
    fetchUserDataStart,
    fetchUserDataSuccess,
    fetchUserDataFailure,
    clearUserData,
} = userSlice.actions;

// Экспортируем редюсер
export default userSlice.reducer;
