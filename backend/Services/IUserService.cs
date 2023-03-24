using InstaConnect.Models;
using Backend.Services;
using Backend.Models;
using Backend.Validators.UserValidators;

namespace Backend.Interfaces
{
    public interface IUserService : IMongoDbService<UserModel>
    {
        public List<UserModel> GetUsers(string? firstName, string? lastName, string? birthDate);

        public Task<List<UserModel>> GetUsersAsync(string? firstName, string? lastName, string? birthDate);

    }
}