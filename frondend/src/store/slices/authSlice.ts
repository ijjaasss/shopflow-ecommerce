import { createSlice, createAsyncThunk, type PayloadAction} from '@reduxjs/toolkit';
import type { User, ApiResponse } from '../../types';
import api from '../../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post<ApiResponse>('/auth/login', { email, password });
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const response = await api.post<ApiResponse>('/auth/register', { name, email, password });
    return response.data;
  }
);

export const getProfile = createAsyncThunk('auth/getProfile', async () => {
  const response = await api.get<ApiResponse>('/auth/me');
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user!;
          state.token = action.payload.token!;
          localStorage.setItem('token', action.payload.token!);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        if (action.payload.success) {
          state.user = action.payload.user!;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;