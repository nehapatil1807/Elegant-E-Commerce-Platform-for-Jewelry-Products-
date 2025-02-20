﻿using AutoMapper;
using ElegantJewellery.DTOs;
using ElegantJewellery.Enties;
using ElegantJewellery.Models;
using ElegantJewellery.Repositories;
using ElegantJewellery.Services;

public class UserService : IUserService
{
    private readonly IGenericRepository<User> _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public UserService(
        IGenericRepository<User> userRepository,
        IJwtService jwtService,
        IEmailService emailService,
        IMapper mapper,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _emailService = emailService;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<ApiResponse<bool>> ForgotPasswordAsync(string email)
    {
        try
        {
            var users = await _userRepository.GetAllAsync();
            var user = users.FirstOrDefault(u => u.Email.ToLower() == email.ToLower());

            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            // Generate reset token (using JWT for simplicity)
            var token = _jwtService.GeneratePasswordResetToken(user);

            // Send reset email
            await _emailService.SendPasswordResetEmailAsync(
                user.Email,
                $"{user.FirstName} {user.LastName}",
                token
            );

            return ApiResponse<bool>.SuccessResponse(true, "Password reset instructions sent to your email");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.ErrorResponse(
                "Error processing password reset request",
                new List<string> { ex.Message }
            );
        }
    }

    public async Task<ApiResponse<bool>> ResetPasswordAsync(string token, string newPassword)
    {
        try
        {
            // Validate token and get user ID
            var userId = _jwtService.ValidatePasswordResetToken(token);
            if (userId == null)
            {
                return ApiResponse<bool>.ErrorResponse("Invalid or expired reset token");
            }

            var user = await _userRepository.GetByIdAsync(userId.Value);
            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            // Update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _userRepository.UpdateAsync(user);

            // Send confirmation email
            await _emailService.SendPasswordChangeConfirmationAsync(
                user.Email,
                $"{user.FirstName} {user.LastName}"
            );

            return ApiResponse<bool>.SuccessResponse(true, "Password reset successful");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.ErrorResponse(
                "Error resetting password",
                new List<string> { ex.Message }
            );
        }
    }

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(UserDto userDto)
    {
        try
        {
            // Validate email uniqueness
            var emailExists = await CheckEmailExistsAsync(userDto.Email);
            if (emailExists.Data)
            {
                return ApiResponse<AuthResponseDto>.ErrorResponse(
                    "Registration failed",
                    new List<string> { "Email already exists" }
                );
            }

            // Validate role
            if (!string.IsNullOrEmpty(userDto.Role) && !UserRoles.ValidRoles.Contains(userDto.Role))
            {
                return ApiResponse<AuthResponseDto>.ErrorResponse(
                    "Invalid role",
                    new List<string> { $"Valid roles are: {string.Join(", ", UserRoles.ValidRoles)}" }
                );
            }

            var user = _mapper.Map<User>(userDto);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            user.Role = string.IsNullOrEmpty(userDto.Role) ? UserRoles.User : userDto.Role;

            var createdUser = await _userRepository.AddAsync(user);

            // Send welcome email
            try
            {
                await _emailService.SendWelcomeEmailAsync(
                    createdUser.Email,
                    $"{createdUser.FirstName} {createdUser.LastName}"
                );
            }
            catch (Exception emailEx)
            {
                // Log the email error but don't fail the registration
                Console.WriteLine($"Failed to send welcome email: {emailEx.Message}");
            }

            var token = _jwtService.GenerateToken(createdUser);
            var userResponse = _mapper.Map<UserResponseDto>(createdUser);

            return ApiResponse<AuthResponseDto>.SuccessResponse(
                new AuthResponseDto { Token = token, User = userResponse },
                "Registration successful"
            );
        }
        catch (Exception ex)
        {
            return ApiResponse<AuthResponseDto>.ErrorResponse(
                "Registration failed",
                new List<string> { ex.Message }
            );
        }
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var users = await _userRepository.GetAllAsync();
                var user = users.FirstOrDefault(u => u.Email.ToLower() == loginDto.Email.ToLower());

                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    return ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Login failed",
                        new List<string> { "Invalid email or password" }
                    );
                }

                var token = _jwtService.GenerateToken(user);
                var userResponse = _mapper.Map<UserResponseDto>(user);

                return ApiResponse<AuthResponseDto>.SuccessResponse(
                    new AuthResponseDto { Token = token, User = userResponse },
                    "Login successful"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<AuthResponseDto>.ErrorResponse(
                    "Login failed",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<UserResponseDto>> GetUserByIdAsync(int userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return ApiResponse<UserResponseDto>.ErrorResponse("User not found");
                }

                var userResponse = _mapper.Map<UserResponseDto>(user);
                return ApiResponse<UserResponseDto>.SuccessResponse(userResponse);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserResponseDto>.ErrorResponse(
                    "Error retrieving user",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<bool>> CheckEmailExistsAsync(string email)
        {
            try
            {
                var users = await _userRepository.GetAllAsync();
                var exists = users.Any(u => u.Email.ToLower() == email.ToLower());
                return ApiResponse<bool>.SuccessResponse(exists);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Error checking email",
                    new List<string> { ex.Message }
                );
            }
        }
    }

