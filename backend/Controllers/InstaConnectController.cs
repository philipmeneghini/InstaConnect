using InstaConnect.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using InstaConnect.Models;
using MongoDB.Driver;
using Backend.Services;
using Backend.UserServices;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace InstaConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InstaConnectController : ControllerBase
    {
        private IUserService _userService;

        public InstaConnectController(IUserService UserService)
        {   
            _userService = UserService;
        }

        [Authorize]
        [HttpGet("User")]
        public async Task<UserModel> GetUser(string? email)
        {
            return await _userService.GetModelAsync(email);
        }

        [Authorize]
        [HttpGet("Users")]
        public async Task<ActionResult<List<UserModel>>> GetUsers(string? firstName, string? lastName, string? birthdate)
        {
            return await _userService.GetUsersAsync(firstName, lastName, birthdate);
        }

        [Authorize]
        [HttpPost("User")]
        public async Task<ActionResult<UserModel>> PostUser(UserModel newUser)
        {
            return await _userService.CreateModelAsync(newUser);
        }

        [Authorize]
        [HttpPost("Users")]
        public async Task<ActionResult<List<UserModel>>> PostUsers(List<UserModel> newUsers)
        {
            return await _userService.CreateModelsAsync(newUsers);
        }


        [Authorize]
        [HttpPut("User")]
        public async Task<ActionResult<UserModel>> PutUser(UserModel newUser)
        {
            return await _userService.UpdateModelAsync(newUser);
        }

        [Authorize]
        [HttpPut("Users")]
        public async Task<ActionResult<List<UserModel>>> PutUsers(List<UserModel> newUsers)
        {
            return await _userService.UpdateModelsAsync(newUsers);
        }

        [Authorize]
        [HttpDelete("User")]
        public async Task<ActionResult<UserModel>> DeleteUser(string email)
        {
            return await _userService.DeleteModelAsync(email);
        }
    }
}