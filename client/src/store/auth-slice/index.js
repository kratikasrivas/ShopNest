import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null
};

export const registerUser = createAsyncThunk('/auth/register', async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', formData);
        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
});


export const loginUser = createAsyncThunk('/auth/login', async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', formData);
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
});

export const logoutUser = createAsyncThunk('/auth/logout', async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/logout');
        localStorage.removeItem('token');
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
});

export const checkAuth = createAsyncThunk('/auth/checkauth', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { success: false, message: 'No token found' };
    }

    try {
        const response = await axios.get('http://localhost:5000/api/auth/check-auth', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Check auth error:', error);
        return { success: false, message: 'Authentication failed' };
    } 
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});
export const { setUser } = authSlice.actions;
export default authSlice.reducer;