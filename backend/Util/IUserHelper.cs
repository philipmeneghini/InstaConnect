using Backend.Models;

namespace Backend.Util
{
    public interface IUserHelper
    {
        public bool CompareFollowers(string loggedInUser, UserModel a, UserModel b);
    }
}
