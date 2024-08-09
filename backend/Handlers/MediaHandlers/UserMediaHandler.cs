using Backend.Models;
using Backend.Services.Interfaces;
using Util.Constants;
using Util.Exceptions;
using Util.MediaType;
using static Amazon.S3.HttpVerb;

namespace Backend.Handlers.MediaHandlers
{
    public class UserMediaHandler : AbstractMediaHandler<UserModel>, IMediaHandler<UserModel>
    {
        public UserMediaHandler(IMediaService mediaService) : base(mediaService) { }

        public void AttachPresignedUrls(UserModel user, bool includeUpload = false)
        {
            string profilePictureUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture);
            user.ProfilePictureUrl = profilePictureUrl;

            string reelsUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
            user.ReelsUrl = reelsUrl;

            string photosUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
            user.PhotosUrl = photosUrl;

            if (includeUpload)
            {
                string profilePictureUploadUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture);
                user.UploadProfilePictureUrl = profilePictureUploadUrl;

                string reelsUploadUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels);
                user.UploadReelsUrl = reelsUploadUrl;

                string photosUploadUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels);
                user.UploadPhotosUrl = photosUploadUrl;
            }
        }

        public void AttachPresignedUrls(IEnumerable<UserModel> users, bool includeUpload = false)
        {
            foreach(var user in users)
            {
                string profilePictureUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture);
                user.ProfilePictureUrl = profilePictureUrl;

                string reelsUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
                user.ReelsUrl = reelsUrl;

                string photosUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
                user.PhotosUrl = photosUrl;

                if (includeUpload)
                {
                    string profilePictureUploadUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture);
                    user.UploadProfilePictureUrl = profilePictureUploadUrl;

                    string reelsUploadUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels);
                    user.UploadReelsUrl = reelsUploadUrl;

                    string photosUploadUrl = GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels);
                    user.UploadPhotosUrl = photosUploadUrl;
                }
            }
        }

        public void RemoveMedia(UserModel user)
        {
            DeleteMedia(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName);
            DeleteMedia(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName);
            DeleteMedia(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName);
        }

        public void RemoveMedia(IEnumerable<UserModel> users)
        {
            foreach(var user in users)
            {
                DeleteMedia(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName);
                DeleteMedia(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName);
                DeleteMedia(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName);
            }
        }

        private string GenerateKey(string id, MediaType destination)
        {
            string res = string.Empty;
            switch (destination)
            {
                case MediaType.ProfilePicture:
                    res = string.Format(ApplicationConstants.ProfilePictureDestination, id);
                    break;
                case MediaType.Photos:
                    res = string.Format(ApplicationConstants.PhotosDestination, id);
                    break;
                case MediaType.Reels:
                    res = string.Format(ApplicationConstants.ReelsDestination, id);
                    break;
                default:
                    throw new InstaInternalServerException(ApplicationConstants.AwsDestinationNotFound);
            }
            return res;
        }
    }
}
