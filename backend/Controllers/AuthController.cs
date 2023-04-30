using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<string> Login([FromBody] LoginBody login)
        {
            return await _authService.Login(login);
        }

        [Authorize]
        [HttpPost("Register")]
        public async Task<UserModel> Register([FromBody] LoginBody request)
        {
            return await _authService.Register(request);
        }
    }
}
