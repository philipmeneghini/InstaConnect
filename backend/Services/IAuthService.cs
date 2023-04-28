using Backend.Models;
using InstaConnect.Models;

namespace Backend.Services
{
    public interface IAuthService
    {
        public Task<string> Login(LoginBody request);

        public Task<UserModel> Register(LoginBody request);
    }
}
