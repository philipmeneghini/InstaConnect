using Backend.Models;

namespace Backend.Util
{
    public class UserHelper : IUserHelper
    {
        public bool CompareFollowers(string loggedInUser, UserModel a, UserModel b)
        {
            if ((a.Id == null || b.Id == a.Id) 
                 && (a.Email == null || b.Email == a.Email)
                 && (a.Password == null || b.Password == a.Password)
                 && (a.FirstName == null || b.FirstName == a.FirstName)
                 && (a.LastName == null || b.LastName == a.LastName)
                 && (a.BirthDate == null || b.BirthDate == a.BirthDate)
                 && (a.Following == null || GetDifference<string>(b.Following, a.Following).Count == 0)
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

        private bool OnlyOneDifference(string? difference, HashSet<string>? list1, HashSet<string>? list2)
        {
            if (difference == null || list1 == null || list2 == null)
                return false;
            var set = GetDifference<string>(list1, list2);
            if ((set.Count == 1 && set.Contains(difference))
                || set.Count == 0)
                return true;
            return false;
        }

        private HashSet<T> GetDifference<T>(HashSet<T> h1, HashSet<T> h2)
        {
            return h1.Except(h2).Concat(h2.Except(h1)).ToHashSet();
        }

    }
}
