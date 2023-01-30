using InstaConnect.Models;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        public string GetUser(string firstName, string lastName);
    }
}