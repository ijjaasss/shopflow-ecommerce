import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderItem, ShippingAddress, ApiResponse } from '../../types';
import api from '../../services/api';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({ orderItems, shippingAddress }: { orderItems: OrderItem[]; shippingAddress: ShippingAddress }) => {
    const response = await api.post<ApiResponse>('/orders/create', { orderItems, shippingAddress });
    return response.data;
  }
);

export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async () => {
  const response = await api.get<ApiResponse>('/orders/my-orders');
  return response.data;
});

export const fetchOrderById = createAsyncThunk('order/fetchOrderById', async (id: string) => {
  const response = await api.get<ApiResponse>(`/orders/${id}`);
  return response.data;
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.currentOrder = action.payload.order!;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      .addCase(fetchMyOrders.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        if (action.payload.success) {
          state.orders = action.payload.orders!;
        }
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        if (action.payload.success) {
          state.currentOrder = action.payload.order!;
        }
      });
  },
});

export const { clearError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;