package com.cdac.service;

import java.util.List;

import com.cdac.exception.UserException;
import com.cdac.modal.User;

public interface UserService {
	
	public User findUserById(Long userId) throws UserException;
	
	public User findUserProfileByJwt(String jwt) throws UserException;
	
	public List<User> findAllUsers();

}
