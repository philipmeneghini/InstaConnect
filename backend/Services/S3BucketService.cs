using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.Extensions.Options;

namespace Backend.Services
{
    public class S3BucketService: IS3BucketService
    {
        private AmazonS3Client client;
        private AmazonS3CredentialsModel _keys;

        public S3BucketService (IOptions<AmazonS3CredentialsModel> amazonS3CredentialsModel)
        {
            _keys = amazonS3CredentialsModel.Value;
            var credentials = new BasicAWSCredentials(_keys.AccessKey, _keys.SecretKey);
            client = new AmazonS3Client(credentials, RegionEndpoint.USEast1);
        }

        public async Task<bool> VerifyBucket(string name)
        {
            bool result = await AmazonS3Util.DoesS3BucketExistV2Async(client, name);
            return result;
        }

        public string GeneratePresignedUrl(string key, string name)
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
