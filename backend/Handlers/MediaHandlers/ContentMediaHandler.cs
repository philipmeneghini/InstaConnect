using Backend.Models;
using Backend.Services.Interfaces;
using Util.Constants;
using Util.Exceptions;
using Util.MediaType;
using static Amazon.S3.HttpVerb;

namespace Backend.Handlers.MediaHandlers
{
    public class ContentMediaHandler : AbstractMediaHandler<ContentModel>, IMediaHandler<ContentModel>
    {
        public ContentMediaHandler(IMediaService mediaService) : base(mediaService) { }

        public void AttachPresignedUrls(ContentModel content, bool includeUpload = false)
        {
            string url = GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType);
            content.MediaUrl = url;

            if (includeUpload)
            {
                string uploadUrl = GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, PUT, content.MediaType);
                content.UploadMediaUrl = uploadUrl;
            }
        }

        public void AttachPresignedUrls(IEnumerable<ContentModel> contents, bool includeUpload = false)
        {
            foreach(var content in contents)
            {
                string url = GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType);
                content.MediaUrl = url;

                if (includeUpload)
                {
                    string uploadUrl = GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, PUT, content.MediaType);
                    content.UploadMediaUrl = uploadUrl;
                }
            }
        }

        public void RemoveMedia(ContentModel content)
        {
            DeleteMedia(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName);
        }

        public void RemoveMedia(IEnumerable<ContentModel> contents)
        {
            foreach(var content in contents)
            {
                DeleteMedia(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName);
            }
        }

        private string GenerateKey(string email, string id, MediaType destination)
        {
            string res;
            switch (destination)
            {
                case MediaType.ProfilePicture:
                    res = string.Format(ApplicationConstants.ProfilePictureDestination, email, id);
                    break;
                case MediaType.Photos:
                    res = string.Format(ApplicationConstants.PhotosContentDestination, email, id);
                    break;
                case MediaType.Reels:
                    res = string.Format(ApplicationConstants.ReelsContentDestination, email, id);
                    break;
                default:
                    throw new InstaInternalServerException(ApplicationConstants.AwsDestinationNotFound);
            }
            return res;
        }
    }
}
