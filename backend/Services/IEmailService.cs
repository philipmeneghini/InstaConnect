using Backend.Models;

namespace Backend.Services
{
    public interface IEmailService
    {
        public Task<bool> SendRegistrationEmailAsync(UserModel user);

        public Task<bool> SendResetPasswordEmailAsync(UserModel user);
    }
}