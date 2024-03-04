using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace InstaConnect.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private IUserService _userService;

        public UserController(IUserService UserService)
        {   
            _userService = UserService;
        }

        [HttpGet("User")]
        public async Task<UserModel> GetUser([FromQuery] string? email)
        {
            return await _userService.GetUserAsync(email);
        }

        [HttpGet("Users")]
        public async Task<ActionResult<List<UserModel>>> GetUsers([FromQuery] List<string>? emails)
        {
            return await _userService.GetUsersAsync(emails);
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPost("User")]
        public async Task<ActionResult<UserModel>> PostUser([FromBody] UserModel? newUser)
        {
            return await _userService.CreateUserAsync(newUser);
        }

        [Authorize(Policy = "AdminPolicy")]
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

        [Authorize(Policy = "UserPolicy")]
        [HttpPut("Users")]
        public async Task<ActionResult<List<UserModel>>> PutUsers([FromBody] List<UserModel>? newUsers)
        {
            return await _userService.UpdateUsersAsync(newUsers); 
        }

        [Authorize(Policy = "UserDeletePolicy")]
        [HttpDelete("User")]
        public async Task<ActionResult<UserModel>> DeleteUser([FromQuery] string? email)
        {
            return await _userService.DeleteUserAsync(email);
        }
    }
}