using Backend.Models;

namespace Backend.Util
{
    public class Helpers
    {
        public static void RemoveUrls(ref UserModel user)
        {
            user.ProfilePictureUrl = null;
            user.ReelsUrl = null;
            user.PhotosUrl = null;
        }
    }
}
