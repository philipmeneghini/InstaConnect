﻿using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using Backend.Services.Interfaces;
using Backend.Models.Config;
using Util.Exceptions;
using Microsoft.Extensions.Options;
using Util.Constants;
using Util.MediaType;

namespace Backend.Services
{
    public class MediaService: IMediaService
    {
        private IAmazonS3 _client;
        private AmazonCredentialsModel _keys;

        public MediaService (IOptionsSnapshot<AmazonCredentialsModel> amazonS3CredentialsModel)
        {
            _keys = amazonS3CredentialsModel.Get(ApplicationConstants.S3);
            var credentials = new BasicAWSCredentials(_keys.AccessKey, _keys.SecretKey);
            _client = new AmazonS3Client(credentials, RegionEndpoint.USEast1);
        }

        public async Task<bool> VerifyBucket(string bucketName)
        {
            var result = await AmazonS3Util.DoesS3BucketExistV2Async(_client, bucketName);
            return result;
        }

        public string GeneratePresignedUrl(string key, string bucketName, HttpVerb action, MediaType media)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = key,
                Verb = action,
                Expires = DateTime.UtcNow.AddMinutes(2)
            };

            if (action == HttpVerb.PUT && ApplicationConstants.MediaContentType.ContainsKey(MediaTypeConverter.MediaToString(media)))
                request.ContentType = ApplicationConstants.MediaContentType[MediaTypeConverter.MediaToString(media)];

            return _client.GetPreSignedURL(request);
        }

        public async void DeleteMedia(string key, string bucketName)
        {
            DeleteObjectRequest request = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = key
            };
            
            var response = await _client.DeleteObjectAsync(request);
        }
    }
}
