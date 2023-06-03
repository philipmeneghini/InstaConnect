using Util.Constants;

namespace Util.MediaType
{
    public enum MediaType
    {
        ProfilePicture,
        Photos,
        Reels,
        Unknown
    }

    public class MediaTypeConverter
    {
        public static bool TryParse(MediaType media)
        {
            if (!Enum.IsDefined(typeof(MediaType), media))
                return false;
            return true;
        }

        public static string MediaToString(MediaType media)
        {
            string res = string.Empty;
            switch (media)
            {
                case MediaType.ProfilePicture:
                    res = ApplicationConstants.ProfilePicture;
                    break;
                case MediaType.Photos:
                    res = ApplicationConstants.Photos;
                    break;
                case MediaType.Reels:
                    res = ApplicationConstants.Reels;
                    break;
            }
            return res;
        }

        public static MediaType StringToMedia(string media)
        {
            switch (media.ToLower())
            {
                case "profile picture":
                    return MediaType.ProfilePicture;
                case "photos":
                    return MediaType.Photos;
                case "reels":
                    return MediaType.Reels;
                default:
                    return MediaType.Unknown;
            }
        }
    }
}