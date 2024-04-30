using Backend.Models;

namespace Backend.Util
{
    public class CommentHelper : AbstractHelper<CommentModel>, ICommentHelper
    {
        public bool CompareLikes(string loggedInUser, CommentModel a, CommentModel b)
        {
            if ((a.Id == null || b.Id == a.Id)
                 && (a.Email == null || b.Email == a.Email)
                 && (a.Body == null || b.Body == b.Body)
                 && (a.Likes == null || OnlyOneDifference(loggedInUser, a.Likes, b.Likes)))
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
