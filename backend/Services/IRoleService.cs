using Backend.Models;

namespace Backend.Services
{
    public interface IRoleService
    {
        public UserModel AssignRole(RoleModel? role);
        public Task<UserModel> AssignRoleAsync(RoleModel? role);

        public List<UserModel> AssignRoles(List<RoleModel>? roles);
        public Task<List<UserModel>> AssignRolesAsync(List<RoleModel>? roles);
    }
}
