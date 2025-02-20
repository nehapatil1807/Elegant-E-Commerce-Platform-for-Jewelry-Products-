using System.ComponentModel.DataAnnotations;

namespace ElegantJewellery.DTOs
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string NewPassword { get; set; }

    }
}
