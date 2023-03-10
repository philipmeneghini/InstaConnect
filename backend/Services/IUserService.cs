using InstaConnect.Models;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        public List<UserModel> GetUsers(string firstName, string lastName);

        public UserModel GetUser(string email);

        public UserModel CreateUser(UserModel newUser);

        public UserModel UpdateUser(UserModel newUser);

        public UserModel DeleteUser(string email);
    }
}