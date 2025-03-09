// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: null,
        roles: [],
    },
    reducers: {
        setUser: (state, action) => {
            state.token = action.payload.token;
            state.roles = action.payload.roles;
        },
        clearUser: (state) => {
            state.token = null;
            state.roles = [];
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
