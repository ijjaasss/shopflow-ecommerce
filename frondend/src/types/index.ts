export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  product: string | Product;
  name?: string;
  qty: number;
  price: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user?: string | User;
  orderItems: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: ShippingAddress;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  user?: User;
  product?: Product;
  products?: Product[];
  order?: Order;
  orders?: Order[];
  stats?: AdminStats;
  total?: number;
  page?: number;
  pages?: number;
  count?: number;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  lowStockCount: number;
}