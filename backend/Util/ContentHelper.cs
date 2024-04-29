using Backend.Models;

namespace Backend.Util
{
    public class ContentHelper : AbstractHelper<ContentModel>, IContentHelper
    {
        public bool CompareLikes(string loggedInUser, ContentModel a, ContentModel b)
        {
            if ((a.Id == null || b.Id == a.Id)
                 && (a.Email == null || b.Email == a.Email)
                 && (a.Caption == null || b.Caption == a.Caption)
                 && (a.MediaType == null || b.MediaType == a.MediaType)
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
