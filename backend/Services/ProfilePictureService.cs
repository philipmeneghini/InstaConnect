using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using Backend.Interfaces;
using Backend.Models;
using Backend.Util.Exceptions;
using Microsoft.Extensions.Options;
using Util.Constants;

namespace Backend.Services
{
    public class ProfilePictureService: IProfilePictureService
    {
        private AmazonS3Client _client;
        private AmazonS3CredentialsModel _keys;

        public ProfilePictureService (IOptions<AmazonS3CredentialsModel> amazonS3CredentialsModel)
        {
            _keys = amazonS3CredentialsModel.Value;
            var credentials = new BasicAWSCredentials(_keys.AccessKey, _keys.SecretKey);
            _client = new AmazonS3Client(credentials, RegionEndpoint.USEast1);
        }

        public async Task<bool> VerifyBucket(string bucketName)
        {
            var result = await AmazonS3Util.DoesS3BucketExistV2Async(_client, bucketName);
            return result;
        }

        public string GeneratePresignedUrl(string key, string bucketName)
        {
            GetPreSignedUrlRequest request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(2)
            };
            return _client.GetPreSignedURL(request);
        }

        public async void DeleteProfilePicture(string key, string bucketName)
        {
            DeleteObjectRequest request = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = key
            };
            var response = await _client.DeleteObjectAsync(request);
            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new InstaGenericException((int)response.HttpStatusCode, string.Format(ApplicationConstants.ErrorDeletingProfilePicture, key));
            }
            return;
        }
    }
}
