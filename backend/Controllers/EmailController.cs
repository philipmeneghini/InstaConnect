using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
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
        public async Task SendRegistrationEmail(string? email)
        {
            await _emailService.SendEmail(email, "test", "Sent an email with .NET!!!");
        }
    }
}
