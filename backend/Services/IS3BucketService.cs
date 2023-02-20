namespace Backend.Interfaces
{
    public interface IS3BucketService
    {
        public Task<bool> VerifyBucket();
        public string GeneratePresignedUrl(string key);
    }
}
