using Backend.Models;

namespace Backend.Services
{
    public interface IEmailService
    {
        public Task<EmailResponse> SendRegistrationEmailAsync(UserModel user);

        public Task<EmailResponse> SendResetPasswordEmailAsync(UserModel user);
    }
}