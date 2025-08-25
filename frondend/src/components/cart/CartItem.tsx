import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';

import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import ConfirmModal from '../ui/ConfirmModal';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const dispatch = useAppDispatch();

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1) {
      dispatch(updateQuantity({ id: item._id, qty: newQty }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item._id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <>
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-gray-600">{formatPrice(item.price)}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(item.qty - 1)}
            disabled={item.qty <= 1}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          
          <span className="w-8 text-center font-medium">{item.qty}</span>
          
          <button
            onClick={() => handleQuantityChange(item.qty + 1)}
            disabled={item.qty >= item.stock}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-900">{formatPrice(item.price * item.qty)}</p>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleRemove}
        title="Remove Item"
        message={`Are you sure you want to remove "${item.name}" from your cart?`}
        confirmText="Remove"
        type="danger"
      />
    </>
  );
};

export default CartItem;