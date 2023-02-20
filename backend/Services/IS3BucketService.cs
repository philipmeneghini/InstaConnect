namespace Backend.Interfaces
{
    public interface IS3BucketService
    {
        public Task<bool> VerifyBucket(string name);
        public string GeneratePresignedUrl(string key, string name);
    }
}
