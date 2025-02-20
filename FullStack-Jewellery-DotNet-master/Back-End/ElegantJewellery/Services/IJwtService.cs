using ElegantJewellery.Models;

namespace ElegantJewellery.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        string GeneratePasswordResetToken(User user);
        int? ValidatePasswordResetToken(string token);
    }
}
