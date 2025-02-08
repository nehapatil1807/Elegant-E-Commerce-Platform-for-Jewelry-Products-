package com.cdac.service;

import com.cdac.exception.ProductException;
import com.cdac.modal.Cart;
import com.cdac.modal.CartItem;
import com.cdac.modal.User;
import com.cdac.request.AddItemRequest;

public interface CartService {
	
	public Cart createCart(User user);
	
	public CartItem addCartItem(Long userId,AddItemRequest req) throws ProductException;
	
	public Cart findUserCart(Long userId);

}
