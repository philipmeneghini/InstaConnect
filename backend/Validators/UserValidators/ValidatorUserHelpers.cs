using Backend.Services;
using InstaConnect.Models;
using InstaConnect.Services;
using MongoDB.Driver;
using Backend.Services;

namespace Backend.Validators.UserValidators
{
    public class ValidatorUserHelpers
    {
        private IMongoDbService<UserModel> _mongoDbService;

        public ValidatorUserHelpers(IMongoDbService<UserModel> mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }
        public bool IsValidName(string name)
        {
            return name.All(char.IsLetter);
        }

        public bool IsValidDate(string date)
        {
            DateTime dateType;
            return DateTime.TryParse(date, out dateType);
        }

        public bool EmailExists(string email)
        {
            var filter = Builders<UserModel>.Filter.Eq(user => user.Email, email);
            var users = _mongoDbService.GetModels(filter);
            int count = users.Count;
            if (count != 1)
            {
                return false;
            }
            return true;
        }

        public bool NoEmailExists(string email)
        {
            int count = _mongoDbService.GetModels(Builders<UserModel>.Filter.Eq(user => user.Email, email)).Count;
            if (count != 0)
            {
                return false;
            }
            return true;
        }

    }
}
