using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace InstaConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private IUserService _userService;

        public UserController(IUserService UserService)
        {   
            _userService = UserService;
        }

        [Authorize]
        [HttpGet("User")]
        public async Task<UserModel> GetUser(string? email)
        {
            return await _userService.GetUserAsync(email);
        }

        [Authorize]
        [HttpGet("Users")]
        public async Task<ActionResult<List<UserModel>>> GetUsers([FromQuery] List<string>? emails)
        {
            return await _userService.GetUsersAsync(emails);
        }

        [Authorize]
        [HttpPost("User")]
        public async Task<ActionResult<UserModel>> PostUser([FromBody] UserModel? newUser)
        {
            return await _userService.CreateUserAsync(newUser);
        }

        [Authorize]
        [HttpPost("Users")]
        public async Task<ActionResult<List<UserModel>>> PostUsers([FromBody] List<UserModel>? newUsers)
        {
            return await _userService.CreateUsersAsync(newUsers);
        }

        [Authorize(Policy = "UserPolicy")]
        [HttpPut("User")]
        public async Task<ActionResult<UserModel>> PutUser([FromBody] UserModel? newUser)
        {
            return await _userService.UpdateUserAsync(newUser);
        }

        [Authorize]
        [HttpPut("Users")]
        public async Task<ActionResult<List<UserModel>>> PutUsers([FromBody] List<UserModel>? newUsers)
        {
            return await _userService.UpdateUsersAsync(newUsers); 
        }

        [Authorize]
        [HttpDelete("User")]
        public async Task<ActionResult<UserModel>> DeleteUser(string? email)
        {
            return await _userService.DeleteUserAsync(email);
        }
    }
}