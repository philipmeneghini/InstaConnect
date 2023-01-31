using InstaConnect.Models;
using Backend.Interfaces;
using Backend.Services;
using MongoDB.Driver;

namespace Backend.UserServices
{
    public class UserServices : IUserServices
    {
        private IMongoDbService _mongoDbService;
        private IMongoCollection<UserModel> _mongoCollection;

        public UserServices(IMongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
            _mongoCollection = _mongoDbService.GetUserCollection();
            
        }
        public List<UserModel> GetUsers(string? firstName, string? lastName)
        {
            List<UserModel> users;

            if (firstName != null && lastName != null)
            {
                users = _mongoCollection.Find(user => user.FirstName == firstName && user.LastName == lastName).ToList();
            }

            else if (firstName == null && lastName != null)
            {
                users = _mongoCollection.Find(user => user.LastName == lastName).ToList();
            }

            else if (firstName != null && lastName == null)
            {
                users = _mongoCollection.Find(user => user.FirstName == firstName).ToList();
            }

            else
            {
                throw new Exception("Missing both first and last name as parameters");
            }

            if (users.Count == 0 )
            {
                throw new Exception("No users with that name are found");
            }

            return users;
        }

        public UserModel GetUser(string? email)
        {
            if (email == null)
            {
                throw new Exception("No email passed in as a parameter");
            }

            UserModel user = _mongoCollection.Find(user => user.Email == email).FirstOrDefault();

            if (user == null)
            {
                throw new Exception("No user with that email found");
            }

            return user;
        }

        public UserModel CreateUser(UserModel newUser)
        {
            _mongoCollection.InsertOne(newUser);
            return newUser;
        }
    }
}