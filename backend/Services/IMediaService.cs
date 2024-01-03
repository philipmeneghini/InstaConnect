using Amazon.S3;
using Util.MediaType;

namespace Backend.Services.Interfaces
{
    public interface IMediaService
    {
        public Task<bool> VerifyBucket(string bucketName);
        
        public string GeneratePresignedUrl(string key, string bucketName, HttpVerb action, MediaType media);
        
        public void DeleteMedia(string key, string bucketName);
    }
}
