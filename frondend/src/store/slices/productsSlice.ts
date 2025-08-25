import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import type { Product, ApiResponse } from '../../types';
import api from '../../services/api';

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await api.get<ApiResponse>(`/product/getproducts?page=${page}&limit=${limit}`);
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string) => {
    const response = await api.get<ApiResponse>(`/product/${id}`);
    return response.data;
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData: FormData) => {
    const response = await api.post<ApiResponse>('/product/addproduct', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }: { id: string; productData: Partial<Product> }) => {
    const response = await api.put<ApiResponse>(`/product/update/${id}`, productData);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await api.delete(`/product/delete/${id}`);
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.products = action.payload.products!;
          state.total = action.payload.total!;
          state.page = action.payload.page!;
          state.pages = action.payload.pages!;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        if (action.payload.success) {
          state.currentProduct = action.payload.product!;
        }
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        if (action.payload.success) {
          state.products.unshift(action.payload.product!);
        }
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        if (action.payload.success) {
          const index = state.products.findIndex(p => p._id === action.payload.product!._id);
          if (index !== -1) {
            state.products[index] = action.payload.product!;
          }
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;