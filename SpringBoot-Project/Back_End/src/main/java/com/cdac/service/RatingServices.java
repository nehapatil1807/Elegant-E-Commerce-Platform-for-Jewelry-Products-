package com.cdac.service;

import java.util.List;

import com.cdac.exception.ProductException;
import com.cdac.modal.Rating;
import com.cdac.modal.User;
import com.cdac.request.RatingRequest;

public interface RatingServices {
	
	public Rating createRating(RatingRequest req,User user) throws ProductException;
	
	public List<Rating> getProductsRating(Long productId);

}
