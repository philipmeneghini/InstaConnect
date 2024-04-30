using Backend.Models;

namespace Backend.Util
{
    public interface ICommentHelper
    {
        public bool CompareLikes(string loggedInUser, CommentModel a, CommentModel b);
    }
}
