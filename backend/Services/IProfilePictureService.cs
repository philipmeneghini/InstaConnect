namespace Backend.Interfaces
{
    public interface IProfilePictureService
    {
        public Task<bool> VerifyBucket(string name);
        public string GeneratePresignedUrl(string key, string name);
    }
}
