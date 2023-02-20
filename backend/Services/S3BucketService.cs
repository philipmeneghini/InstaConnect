using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using Backend.Interfaces;

namespace Backend.Services
{
    public class S3BucketService: IS3BucketService
    {
        private string name;
        private AmazonS3Client client;
        S3BucketService (string name)
        {
            this.client = new AmazonS3Client();
            this.name = name;
        }

        public async Task<bool> VerifyBucket()
        {
            bool result = await AmazonS3Util.DoesS3BucketExistV2Async(client, name);
            return result;
        }

        public string GeneratePresignedUrl(string key)
        {
            GetPreSignedUrlRequest request = new GetPreSignedUrlRequest
            {
                BucketName = name,
                Key = key,
                Expires = DateTime.Now.AddDays(7)
            };
            return client.GetPreSignedURL(request);
        }
    }
}
