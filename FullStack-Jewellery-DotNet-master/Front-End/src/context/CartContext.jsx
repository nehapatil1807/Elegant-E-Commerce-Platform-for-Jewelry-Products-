import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Use the flag on initial mount.
    fetchCart(true);
  }, [user]);

  // Accept a parameter to indicate if this is the initial fetch.
  const fetchCart = async (isInitial = false) => {
    if (!user) {
      setCart(null);
      if (isInitial) setLoading(false);
      return;
    }
    
    try {
      if (isInitial) setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

 

  const addToCart = async (productId, quantity) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      if (response.success) {
        // No need for a global loading change here.
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await cartService.updateQuantity(productId, quantity);
      if (response.success) {
        // Do not trigger global loading spinner during updates.
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await cartService.removeFromCart(productId);
      if (response.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };



const clearCart = async () => {
  try {
    const response = await cartService.clearCart();
    if (response.success) {
      setCart(null);
      await fetchCart();
      return { success: true };
    }
    return { success: false, message: response.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};