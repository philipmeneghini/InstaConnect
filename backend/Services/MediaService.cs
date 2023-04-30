using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using Backend.Services.Interfaces;
using Backend.Models.Config;
using Util.Exceptions;
using Microsoft.Extensions.Options;
using Util.AwsDestination;
using Util.Constants;

namespace Backend.Services
{
    public class MediaService: IMediaService
    {
        private AmazonS3Client _client;
        private AmazonS3CredentialsModel _keys;

        public MediaService (IOptions<AmazonS3CredentialsModel> amazonS3CredentialsModel)
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

        public string GeneratePresignedUrl(string id, string bucketName, AwsDestination destination)
        {
            string key = GenerateKey(id, destination);
            GetPreSignedUrlRequest request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(2)
            };
            return _client.GetPreSignedURL(request);
        }

        public async void DeleteMedia(string id, string bucketName, AwsDestination destination)
        {
            string key = GenerateKey(id, destination);
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

        private string GenerateKey(string id, AwsDestination destination)
        {
            string res = string.Empty;
            switch (destination)
            {
                case AwsDestination.ProfilePicture:
                    res = string.Format(ApplicationConstants.ProfilePicture, id);
                    break;
                case AwsDestination.Photos:
                    res = string.Format(ApplicationConstants.Photos, id);
                    break;
                case AwsDestination.Reels:
                    res = string.Format(ApplicationConstants.Reels, id);
                    break;
                default:
                    throw new InstaInternalServerException(ApplicationConstants.AwsDestinationNotFound);
            }
            return res;
        }
    }
}
