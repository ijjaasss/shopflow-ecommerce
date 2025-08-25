import React, { useState } from 'react';
import { ShoppingCart, Eye, Package } from 'lucide-react';


import { addToCart } from '../../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleAddToCart = async () => {
    if (!user || user.role !== 'customer') return;

    setIsAddingToCart(true);
    dispatch(addToCart({ product, qty: 1 }));
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      <div className="aspect-[1/1] relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/product/${product._id}`}
            className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</span>
          <div className="flex items-center space-x-1 text-gray-500">
            <Package size={16} />
            <span className="text-sm">{product.stock} left</span>
          </div>
        </div>

        {user?.role === 'customer' && (
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isAddingToCart
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
            }`}
          >
            <ShoppingCart size={18} />
            <span>
              {product.stock === 0
                ? 'Out of Stock'
                : isAddingToCart
                ? 'Added!'
                : 'Add to Cart'}
            </span>
          </button>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-orange-600 text-sm mt-2 text-center">Only {product.stock} left in stock!</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;