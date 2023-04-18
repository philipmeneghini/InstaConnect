using Backend.Services;
using InstaConnect.Models;
using InstaConnect.Services;
using MongoDB.Driver;
using Backend.Services;

namespace Backend.Validators.UserValidators
{
    public class ValidatorUserHelpers
    {

        public ValidatorUserHelpers()
        {
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

    }
}
