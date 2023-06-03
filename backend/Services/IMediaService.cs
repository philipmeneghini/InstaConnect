using Amazon.S3;

namespace Backend.Services.Interfaces
{
    public interface IMediaService
    {
        public Task<bool> VerifyBucket(string name);
        
        public string GeneratePresignedUrl(string key, string name, HttpVerb action);
        
        public void DeleteMedia(string key, string bucketName);
    }
}
