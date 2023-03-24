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
        public async Task<ActionResult<UserModel>> GetUser(string? email)
        {
            return await _userService.GetModelAsync(email);
        }

        [HttpGet("Users")]
        public async Task<ActionResult<List<UserModel>>> GetUsers(string? firstName, string? lastName, string? birthdate)
        {
            return await _userService.GetUsersAsync(firstName, lastName, null);
        }

        [HttpPost("User")]
        public async Task<ActionResult<UserModel>> PostUser(UserModel newUser)
        {
            return await _userService.CreateModelAsync(newUser);
        }

        [HttpPut("User")]
        public async Task<ActionResult<UserModel>> PutUser(UserModel newUser)
        {
            return await _userService.UpdateModelAsync(newUser);
        }

        [HttpDelete("User")]
        public async Task<ActionResult<UserModel>> DeleteUser(string email)
        {
            return await _userService.DeleteModelAsync(email);
        }
    }
}