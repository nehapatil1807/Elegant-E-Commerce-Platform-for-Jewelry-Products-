import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import Loading from '../common/Loading';
import { toast } from 'react-toastify';
import './Cart.css';

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isUpdating, 
  isRemoving 
}) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity !== item.quantity) {
      onUpdateQuantity(item.productId, newQuantity);
    }
  };

  return (
    <div className={`cart-item ${isUpdating || isRemoving ? 'item-loading' : ''}`}>
      <div className="row align-items-center">
        <div className="col-md-2 col-4 mb-3 mb-md-0">
          <div className="cart-item-image">
            <img
              src={item.imageUrl || '/placeholder.jpg'}
              alt={item.productName}
              onError={(e) => { e.target.src = '/placeholder.jpg' }}
            />
          </div>
        </div>
        
        <div className="col-md-4 col-8 mb-3 mb-md-0">
          <div className="cart-item-details">
            <h6>{item.productName}</h6>
            <p className="text-muted mb-1">
              Unit Price: {formatPrice(item.productPrice)}
            </p>
            {item.availableStock <= 5 && (
              <small className="text-warning">
                Only {item.availableStock} left in stock
              </small>
            )}
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3 mb-md-0">
          <div className="quantity-control">
            <button
              className="quantity-btn"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
            >
              <i className="bi bi-dash"></i>
            </button>
            <input
              type="text"
              className="quantity-input"
              value={item.quantity}
              readOnly
            />
            <button
              className="quantity-btn"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.availableStock || isUpdating}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>

        <div className="col-md-3 col-6 text-end">
          <div className="fw-bold mb-2">
            {formatPrice(item.subtotal)}
          </div>
          <button
            className="remove-btn"
            onClick={() => onRemove(item.productId)}
            disabled={isRemoving}
          >
            <i className="bi bi-trash"></i>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const navigate = useNavigate();
  const [processingItems, setProcessingItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());

  // Calculate estimated delivery date (3-5 business days)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDays = new Date(today.setDate(today.getDate() + 3));
    const maxDays = new Date(today.setDate(today.getDate() + 2));
    
    return {
      min: minDays.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric' 
      }),
      max: maxDays.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric' 
      })
    };
  };

  const handleQuantityUpdate = async (productId, newQuantity) => {
    try {
      setProcessingItems(prev => new Set(prev).add(productId));
      const result = await updateQuantity(productId, newQuantity);
      if (!result.success) {
        toast.error(result.message || 'Failed to update quantity');
      }
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId));
      const result = await removeFromCart(productId);
      if (result.success) {
        toast.success('Item removed from cart');
      } else {
        toast.error('Failed to remove item');
      }
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (loading) return <Loading />;

  if (!cart?.items?.length) {
    return (
      <div className="empty-cart">
        <i className="bi bi-cart3"></i>
        <h2>Your Cart is Empty</h2>
        <p>
          Looks like you haven't added anything to your cart yet.
          <br />
          Browse our collection and find something you'll love!
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  const delivery = getEstimatedDelivery();

  return (
    <div className="cart-page">
      <div className="container">
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Shopping Cart ({cart.items.length} items)</h4>
              <Link to="/products" className="btn btn-outline-secondary">
                Continue Shopping
              </Link>
            </div>

            {cart.totalAmount < 1000 && (
              <div className="shipping-alert">
                <i className="bi bi-info-circle"></i>
                <span>
                  Add {formatPrice(1000 - cart.totalAmount)} more to get free shipping!
                </span>
              </div>
            )}

            {cart.items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={handleQuantityUpdate}
                onRemove={handleRemoveItem}
                isUpdating={processingItems.has(item.productId)}
                isRemoving={removingItems.has(item.productId)}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="order-summary">
              <h5 className="summary-title">Order Summary</h5>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>

              <button 
                className="btn btn-primary w-100 mb-3"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>

              <div className="text-center">
                <i className="bi bi-shield-check text-success me-2"></i>
                <small className="text-muted">Secure Checkout</small>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="delivery-info">
              <h6>
                <i className="bi bi-truck"></i>
                Estimated Delivery
              </h6>
              <p className="mb-0">
                {delivery.min} - {delivery.max}
                <br />
                <small className="text-muted">
                  Standard Delivery (3-5 business days)
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;