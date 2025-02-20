package com.cdac.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.config.JwtTokenProvider;
import com.cdac.exception.UserException;
import com.cdac.modal.User;
import com.cdac.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {

    private UserRepository userRepository;
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private EmailService emailService;  // Inject Email Service

    public UserServiceImplementation(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public User findUserById(Long userId) throws UserException {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get();
        }
        throw new UserException("User not found with ID: " + userId);
    }

    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
        String email = jwtTokenProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("User does not exist with email: " + email);
        }
        return user;
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc();
    }

    // New method to register a user and send email
    public User registerUser(User user) throws UserException {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new UserException("Email is already used with another account");
        }

        user.setPassword(user.getPassword()); // Ensure password is already encoded
        User savedUser = userRepository.save(user);

        // Send registration email
        emailService.sendRegistrationEmail(user.getEmail(), user.getFirstName());

        return savedUser;
    }
}
