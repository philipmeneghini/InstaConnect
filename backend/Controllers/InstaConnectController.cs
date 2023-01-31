using InstaConnect.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using InstaConnect.Models;
using MongoDB.Driver;
using Backend.Services.InstaConnectServices;
using Backend.Services;
using Backend.UserServices;
using Backend.Interfaces;

namespace InstaConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InstaConnectController : ControllerBase
    {

        private IInstaConnectServices _instaConnectServices;
        private IUserServices _userService;

        public InstaConnectController(IInstaConnectServices InstaConnectServices, IUserServices UserService)
        {
            _instaConnectServices = InstaConnectServices;
            _userService = UserService;
        }

        [HttpGet("GetConnection")]
        public string? GetConnection()
        {
            return _instaConnectServices.GetConnectionMessage();
        }

        [HttpGet("Users")]
        public List<UserModel> GetUsers(string? firstName, string? lastName)
        {
            return _userService.GetUsers(firstName, lastName);
        }

        [HttpGet("User")]
        public UserModel GetUser(string? email)
        {
            return _userService.GetUser(email);
        }

        [HttpPost("User")]
        public UserModel PostUser(UserModel newUser)
        {
            return _userService.CreateUser(newUser);
        }
    }
}