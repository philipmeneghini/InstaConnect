using Backend.Models;

namespace Backend.Util
{
    public interface IContentHelper
    {
        public bool CompareLikes(string loggedInUser, ContentModel a, ContentModel b);
    }
}
