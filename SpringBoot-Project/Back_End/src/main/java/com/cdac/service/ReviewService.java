package com.cdac.service;

import java.util.List;

import com.cdac.exception.ProductException;
import com.cdac.modal.Review;
import com.cdac.modal.User;
import com.cdac.request.ReviewRequest;

public interface ReviewService {

	public Review createReview(ReviewRequest req,User user) throws ProductException;
	
	public List<Review> getAllReview(Long productId);
	
	
}
