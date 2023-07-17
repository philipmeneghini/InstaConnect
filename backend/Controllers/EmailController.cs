using Backend.Models;
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
        public async Task SendRegistrationEmail([FromBody] UserModel user)
        {
            await _emailService.SendRegistrationEmailAsync(user);
        }
    }
}
