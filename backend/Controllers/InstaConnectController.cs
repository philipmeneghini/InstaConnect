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
        private IUserService _userService;

        public InstaConnectController(IInstaConnectServices InstaConnectServices, IUserService UserService)
        {
            _instaConnectServices = InstaConnectServices;
            _userService = UserService;
        }

        [HttpGet("GetConnection")]
        public string? GetConnection()
        {
            return _instaConnectServices.GetConnectionMessage();
        }

        [HttpGet("User")]
        public ActionResult<UserModel> GetUser(string? email)
        {
            return _userService.GetUser(email);
        }

        [HttpGet("Users")]
        public List<UserModel> GetUsers(string? firstName, string? lastName)
        {
            return _userService.GetUsers(firstName, lastName);
        }

        [HttpPost("User")]
        public UserModel PostUser(UserModel newUser)
        {
            return _userService.CreateUser(newUser);
        }

        [HttpPut("User")]
        public UserModel PutUser(UserModel newUser)
        {
            return _userService.UpdateUser(newUser);
        }

        [HttpDelete("User")]
        public UserModel DeleteUser(string email)
        {
            return _userService.DeleteUser(email);
        }
    }
}