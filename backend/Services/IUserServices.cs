using InstaConnect.Models;

namespace Backend.Interfaces
{
    public interface IUserServices
    {
        public List<UserModel> GetUsers(string firstName, string lastName);

        public UserModel GetUser(string email);

        public UserModel CreateUser(UserModel newUser);

        public List<UserModel> CreateUsers(List<UserModel> newUsers);
    }
}