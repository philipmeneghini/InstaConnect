using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IAuthService
    {
        public Task<string> Login(LoginBody request);

        public Task<UserModel> Register(LoginBody request);

        public string GenerateToken(UserModel user);

        public JwtModel VerifyToken(string token);
    }
}
