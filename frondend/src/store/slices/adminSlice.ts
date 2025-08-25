import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {  AdminStats, ApiResponse,  Order } from '../../types';
import api from '../../services/api';

interface AdminState {
  orders: Order[];
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
}

const initialState: AdminState = {
  orders: [],
  stats: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,
};

export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await api.get<ApiResponse>(`/orders/getAllOrders?page=${page}&limit=${limit}`);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async (id: string) => {
    const response = await api.put<ApiResponse>(`/orders/${id}/status`);
    return response.data;
  }
);

export const fetchAdminStats = createAsyncThunk('admin/fetchAdminStats', async () => {
  const response = await api.get<ApiResponse>('/admin/stats');
  return response.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.orders = action.payload.orders!;
          state.total = action.payload.total!;
          state.page = action.payload.page!;
          state.pages = action.payload.pages!;
        }
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        if (action.payload.success) {
          const index = state.orders.findIndex(o => o._id === action.payload.order!._id);
          if (index !== -1) {
            state.orders[index] = action.payload.order!;
          }
        }
      })
      .addCase(fetchAdminStats.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        if (action.payload.success) {
          state.stats = action.payload.stats!;
        }
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;