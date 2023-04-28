using InstaConnect.Models;
using Util.AwsDestination;

namespace Backend.Interfaces
{
    public interface IMediaService
    {
        public Task<bool> VerifyBucket(string name);

        public string GeneratePresignedUrl(string id, string name, AwsDestination destination);

        public void DeleteMedia(string id, string bucketName, AwsDestination destination);
    }
}
