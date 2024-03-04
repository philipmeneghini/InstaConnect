using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize(Policy = "AdminPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpPut("Role")]
        public async Task<UserModel> AssignRole([FromBody] RoleModel? roleModel)
        {
            return await _roleService.AssignRoleAsync(roleModel);
        }

        [HttpPut("Roles")]
        public async Task<List<UserModel>> AssignRoles([FromBody] List<RoleModel>? roleModels)
        {
            return await _roleService.AssignRolesAsync(roleModels);
        }
    }
}
