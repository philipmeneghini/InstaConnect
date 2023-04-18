using InstaConnect.Models;

namespace Backend.Interfaces
{
    public interface IProfilePictureService
    {
        public Task<bool> VerifyBucket(string name);

        public string GeneratePresignedUrl(string key, string name);

        public void DeleteProfilePicture(string key, string bucketName);
    }
}
