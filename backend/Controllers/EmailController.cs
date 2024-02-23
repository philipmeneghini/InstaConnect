using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("Registration")]
        public async Task<EmailResponse> SendRegistrationEmail([FromBody] UserModel user)
        {
            return await _emailService.SendRegistrationEmailAsync(user);
        }

        [Authorize(Policy = "UserPolicy")]
        [HttpPost("ResetPassword")]
        public async Task<EmailResponse> SendResetPasswordEmail([FromBody] UserModel user)
        {
            return await _emailService.SendResetPasswordEmailAsync(user);
        }
    }
}
