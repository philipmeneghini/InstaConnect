using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IUserService
    {
        public UserModel GetUser(string? email);
        public Task<UserModel> GetUserAsync(string? email);

        public List<UserModel> GetUsers(string? firstName, string? lastName, string? birthDate);
        public Task<List<UserModel>> GetUsersAsync(string? firstName, string? lastName, string? birthDate);

        public List<UserModel> GetUsers(List<string>? emails);
        public Task<List<UserModel>> GetUsersAsync(List<string>? emails);

        public UserModel CreateUser(UserModel? newUser);
        public Task<UserModel> CreateUserAsync(UserModel? newUser);

        public List<UserModel> CreateUsers(List<UserModel>? newUsers);
        public Task<List<UserModel>> CreateUsersAsync(List<UserModel>? newUsers);

        public UserModel UpdateUser(UserModel? updatedUser);
        public Task<UserModel> UpdateUserAsync(UserModel? updatedUser);

        public List<UserModel> UpdateUsers(List<UserModel>? updatedUsers);
        public Task<List<UserModel>> UpdateUsersAsync(List<UserModel>? updatedUsers);

        public UserModel DeleteUser(string? email);
        public Task<UserModel> DeleteUserAsync(string? email);
    }
}