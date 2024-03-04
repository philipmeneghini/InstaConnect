using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
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
        public async Task<LoginResponse> Login([FromBody] LoginBody login)
        {
            return await _authService.Login(login);
        }

        [HttpPost("Register")]
        public async Task<UserModel> Register([FromBody] LoginBody request)
        {
            return await _authService.Register(request);
        }

        [AllowAnonymous]
        [HttpGet("VerifyToken")]
        public JwtModel VerifyToken(string token)
        {
            return _authService.VerifyToken(token);
        }
    }
}
