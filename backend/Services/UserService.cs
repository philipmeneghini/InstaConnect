using InstaConnect.Models;
using Backend.Interfaces;
using Util.Constants;
using Backend.Services;

namespace Backend.UserServices
{
    public class UserService : IUserService
    {
        private IMongoDbService _mongoDbService;

        public UserService(IMongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }
        public string GetUser(string firstName, string lastName)
        {
            string message = "Did it";
            return message;
            //var collection = _mongoDbService.GetCollection<UserModel>(ApplicationConstants.UserCollectionName);
            //UserModel profile = collection.Find({ "first name": firstName, "last name": lastName});

            //return profile;
        }
    }
}