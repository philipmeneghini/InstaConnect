using Backend.Models;

namespace Backend.Services
{
    public interface IEmailService
    {
        public Task SendRegistrationEmailAsync(UserModel user);
    }
}