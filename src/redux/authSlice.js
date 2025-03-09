import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.token = action.payload.token;
            Cookies.set('token', action.payload.token);
        },
        clearUser: (state) => {
            state.token = null;
            Cookies.remove('token');
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
