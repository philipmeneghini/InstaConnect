using Backend.Models;

namespace Backend.Util
{
    public class UserHelper : Helper<UserModel>, IUserHelper
    {
        public bool CompareFollowers(string loggedInUser, UserModel a, UserModel b)
        {
            if ((a.Id == null || b.Id == a.Id) 
                 && (a.Email == null || b.Email == a.Email)
                 && (a.Password == null || b.Password == a.Password)
                 && (a.FirstName == null || b.FirstName == a.FirstName)
                 && (a.LastName == null || b.LastName == a.LastName)
                 && (a.BirthDate == null || b.BirthDate == a.BirthDate)
                 && (a.Following == null || GetDifference(b.Following, a.Following).Count == 0)
                 && (a.Role == null || b.Role == a.Role)
                 && (a.Followers == null || OnlyOneDifference(loggedInUser, a.Followers, b.Followers)))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
