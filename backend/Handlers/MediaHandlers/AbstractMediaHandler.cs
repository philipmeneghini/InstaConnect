using Amazon.S3;
using Backend.Models;
using Backend.Services.Interfaces;
using Util.MediaType;

namespace Backend.Handlers.MediaHandlers
{
    public abstract class AbstractMediaHandler<T> where T : IInstaModel
    {
        private readonly IMediaService _mediaService;

        protected AbstractMediaHandler(IMediaService mediaService)
        {
            _mediaService = mediaService;
        }

        protected string GeneratePresignedUrl(string key, string bucketName, HttpVerb verb, MediaType mediaType)
        {
            return _mediaService.GeneratePresignedUrl(key, bucketName, verb, mediaType);
        }

        protected void DeleteMedia(string key, string bucketName)
        {
            _mediaService.DeleteMedia(key, bucketName);
        }
    }
}
