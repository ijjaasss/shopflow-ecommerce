import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';

const OrderSuccessPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-green-600" size={48} />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your order. We'll send you a confirmation email shortly with your order details and tracking information.
      </p>

      <div className="space-y-4">
        <Link
          to="/orders"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Package size={20} />
          <span>View My Orders</span>
        </Link>

        <Link
          to="/"
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Home size={20} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;