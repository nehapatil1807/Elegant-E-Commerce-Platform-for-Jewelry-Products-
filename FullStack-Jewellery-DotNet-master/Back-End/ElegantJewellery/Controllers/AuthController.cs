using ElegantJewellery.DTOs;
using ElegantJewellery.Services;
using Microsoft.AspNetCore.Mvc;

namespace ElegantJewellery.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register(UserDto userDto)
        {
            var response = await _userService.RegisterAsync(userDto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login(LoginDto loginDto)
        {
            var response = await _userService.LoginAsync(loginDto);
            return response.Success ? Ok(response) : Unauthorized(response);
        }

        [HttpGet("check-email")]
        public async Task<ActionResult<ApiResponse<bool>>> CheckEmail([FromQuery] string email)
        {
            var response = await _userService.CheckEmailExistsAsync(email);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        // New endpoints for password reset
        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var response = await _userService.ForgotPasswordAsync(model.Email);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var response = await _userService.ResetPasswordAsync(model.Token, model.NewPassword);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}