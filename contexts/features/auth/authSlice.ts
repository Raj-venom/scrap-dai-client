import { USER_ROLE } from '@/constants';
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    status: false,
    userData: null,
    userMode: USER_ROLE.USER,
}

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },

        logout: (state) => {
            state.status = false;
            state.userData = null;
        },

        userMode: (state, action) => {
            state.userMode = action.payload.userMode;
        },
    }

})

export const { login, logout, userMode } = authSlice.actions;

export default authSlice.reducer;