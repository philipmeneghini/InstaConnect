using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IUserService : IMongoDbService<UserModel>
    {
        public List<UserModel> GetUsers(string? firstName, string? lastName, string? birthDate);

        public Task<List<UserModel>> GetUsersAsync(string? firstName, string? lastName, string? birthDate);
    }
}