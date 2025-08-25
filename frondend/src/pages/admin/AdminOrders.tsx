import React, { useEffect, useState } from 'react';
import { ShoppingCart, User, Calendar, DollarSign, Truck } from 'lucide-react';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/adminSlice';
import type { Order } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';

const AdminOrders: React.FC = () => {
  const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllOrders({ page: 1, limit: 50 }));
  }, [dispatch]);

  const handleUpdateStatus = async (order: Order) => {
    await dispatch(updateOrderStatus(order._id));
    setUpdatingOrder(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending':
        return 'Processing';
      case 'Processing':
        return 'Shipped';
      case 'Shipped':
        return 'Delivered';
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <ShoppingCart className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart size={80} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-600">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                {getNextStatus(order.status) && (
                  <button
                    onClick={() => setUpdatingOrder(order)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Truck size={16} />
                    <span>Update to {getNextStatus(order.status)}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <User size={18} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">
                      {typeof order.user === 'object' ? order.user.name : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {typeof order.user === 'object' ? order.user.email : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-lg">{formatPrice(order.totalPrice)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ShoppingCart size={18} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-medium">{order.orderItems.length} item(s)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium text-sm">
                      {order.createdAt && formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                <p className="text-gray-600 text-sm">
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium">
                          {typeof item.product === 'object' ? item.product.name : item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.qty} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!updatingOrder}
        onClose={() => setUpdatingOrder(null)}
        onConfirm={() => updatingOrder && handleUpdateStatus(updatingOrder)}
        title="Update Order Status"
        message={`Are you sure you want to update order #${updatingOrder?._id.slice(-8)} status to "${getNextStatus(updatingOrder?.status || '')}"?`}
        confirmText="Update Status"
        type="info"
      />
    </div>
  );
};

export default AdminOrders;