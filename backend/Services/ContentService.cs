using Backend.Models;
using Backend.Services.Interfaces;
using MongoDB.Driver;
using Util.Constants;
using Util.Exceptions;
using FluentValidation;
using Util.MediaType;
using InstaConnect.Services;
using Backend.Models.Config;
using Microsoft.Extensions.Options;
using static Amazon.S3.HttpVerb;
using Backend.Models.Validation;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System;

namespace Backend.Services
{
    public class ContentService : Repository<ContentModel>, IContentService, ISearchService<ContentModel>
    {
        private readonly IMediaService _mediaService;
        private readonly IValidator<ContentIdValidationModel> _deleteGetContentValidator;
        private readonly IValidator<ContentModel> _createUpdateContentValidator;
        private readonly IValidator<ContentEmailValidationModel> _emailContentValidator;

        public ContentService(IMediaService mediaService, IValidator<ContentIdValidationModel> deleteGetContentValidator, IValidator<ContentEmailValidationModel> emailContentValidator, IValidator<ContentModel> createUpdateContentValidator, IOptions<MongoSettings<ContentModel>> settings): base(settings)
        {
            _mediaService = mediaService;
            _deleteGetContentValidator = deleteGetContentValidator;
            _createUpdateContentValidator = createUpdateContentValidator;
            _emailContentValidator = emailContentValidator;
        }

        public ContentModel GetContent(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.ContentIdEmpty);
            var validationModel = new ContentIdValidationModel(id);
            var validationResult = _deleteGetContentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id);
            var content = GetModel(filter);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType);
            content.MediaUrl = url;

            return content;
        }

        public async Task<ContentModel> GetContentAsync(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.ContentIdEmpty);
            var validationModel = new ContentIdValidationModel(id);
            var validationResult = _deleteGetContentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id);
            var content = await GetModelAsync(filter);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType);
            content.MediaUrl = url;

            return content;
        }

        public async Task<List<ContentModel>> GetContentsAsync(List<string>? ids, List<string>? emails, int? index = null, int? limit = null)
        {
            if ((emails == null || emails.Count == 0)
                && (ids == null || ids.Count == 0))
            {
                throw new InstaBadRequestException(ApplicationConstants.EmailIdEmpty);
            }

            List<FilterDefinition<ContentModel>> filters = new List<FilterDefinition<ContentModel>>() { };
            if (emails != null && emails.Count != 0)
            {
                foreach (var email in emails)
                {
                    var validationModel = new ContentEmailValidationModel(email);
                    var validationResult = _emailContentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
                    ThrowExceptions(validationResult);

                    filters.Add(Builders<ContentModel>.Filter.Eq(ApplicationConstants.Email, email));
                }
            }
            if (ids != null && ids.Count != 0)
            {
                foreach (var id in ids)
                {
                    filters.Add(Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id));
                }
            }

            var aggregatedFilter = Builders<ContentModel>.Filter.Or(filters);
            var sort = Builders<ContentModel>.Sort.Descending(c => c.DateCreated);
            var lazyLoad = (limit == null ? null : new LazyLoadModel(index, limit ?? 0));
 
            var contents = await GetModelsAsync(aggregatedFilter, sort, lazyLoad);

            if (contents.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NoContentFound);
            contents.ForEach(content => content.MediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType));

            return contents;
        }

        public List<ContentModel> GetContents(List<string>? ids, List<string>? emails, int? index = null, int? limit = null)
        {
            if ((emails == null || emails.Count == 0)
                && (ids == null || ids.Count == 0))
            {
                throw new InstaBadRequestException(ApplicationConstants.EmailIdEmpty);
            }

            FilterDefinition<ContentModel>[] filters = new FilterDefinition<ContentModel>[] { };
            if (emails != null && emails.Count != 0)
            {
                foreach (var email in emails)
                {
                    var validationModel = new ContentEmailValidationModel(email);
                    var validationResult = _emailContentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
                    ThrowExceptions(validationResult);

                    filters.Append(Builders<ContentModel>.Filter.Eq(ApplicationConstants.Email, email));
                }
            }
            else if (ids != null && ids.Count != 0)
            {
                foreach (var id in ids)
                {
                    filters.Append(Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id));
                }
            }

            var aggregatedFilter = Builders<ContentModel>.Filter.Or(filters);
            var sort = Builders<ContentModel>.Sort.Descending(c => c.DateCreated);
            var lazyLoad = (limit == null ? null : new LazyLoadModel(index, limit ?? 0));

            var contents = GetModels(aggregatedFilter, sort, lazyLoad);
            if (index != null && limit != null)
                contents = contents.OrderByDescending(c => c.DateCreated).Skip((int)index * (int)limit).Take((int)limit).ToList();

            if (contents.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NoContentFound);
            contents.ForEach(content => content.MediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType));

            return contents;
        }

        public ContentModel CreateContent(ContentModel? newContent)
        {
            if (newContent == null) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            var validationResult = _createUpdateContentValidator.Validate(newContent, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);
            newContent.DateCreated = DateTime.UtcNow;
            newContent.DateUpdated = DateTime.UtcNow;
            newContent.Likes = new HashSet<string>();

            var content = CreateModel(newContent);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType);
            string uploadUrl = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, PUT, content.MediaType);
            content.MediaUrl = url;
            content.UploadMediaUrl = uploadUrl;

            return content;
        }

        public async Task<ContentModel> CreateContentAsync(ContentModel? newContent)
        {
            if (newContent == null) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            var validationResult = _createUpdateContentValidator.Validate(newContent, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);
            newContent.DateCreated = DateTime.UtcNow;
            newContent.DateUpdated = DateTime.UtcNow;
            newContent.Likes = new HashSet<string>();

            var content = await CreateModelAsync(newContent);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType);
            string uploadUrl = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, PUT, content.MediaType);
            content.MediaUrl = url;
            content.UploadMediaUrl = uploadUrl;

            return content;
        }

        public List<ContentModel> CreateContents(List<ContentModel>? newContents)
        {
            if (newContents == null || newContents.Count ==0) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            List<ContentModel> result = new();
            foreach (var newContent in newContents)
            {
                var validationResult = _createUpdateContentValidator.Validate(newContent, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                newContent.DateCreated = DateTime.UtcNow;
                newContent.DateUpdated = DateTime.UtcNow;
                newContent.Likes = new HashSet<string>();

                result.Add(newContent);
            }
            var contents = CreateModels(result);
            contents.ForEach(c => c.MediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName, GET, c.MediaType));
            contents.ForEach(c => c.UploadMediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName, PUT, c.MediaType));

            return contents;
        }

        public async Task<List<ContentModel>> CreateContentsAsync(List<ContentModel>? newContents)
        {
            if (newContents == null || newContents.Count == 0) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            List<ContentModel> result = new();
            foreach (var newContent in newContents)
            {
                var validationResult = _createUpdateContentValidator.Validate(newContent, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                newContent.DateCreated = DateTime.UtcNow;
                newContent.DateUpdated = DateTime.UtcNow;
                newContent.Likes = new HashSet<string>();

                result.Add(newContent);
            }

            var contents = await CreateModelsAsync(result);
            contents.ForEach(c => c.MediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName, GET, c.MediaType));
            contents.ForEach(c => c.UploadMediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName, PUT, c.MediaType));

            return contents;
        }

        public ContentModel UpdateContent(ContentModel? updatedContent)
        {
            if (updatedContent == null) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            var validationResult = _createUpdateContentValidator.Validate(updatedContent, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);
            updatedContent.MediaUrl = null;
            updatedContent.DateUpdated = DateTime.UtcNow;

            var content = UpdateModel(updatedContent);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType);
            string uploadUrl = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, PUT, content.MediaType);
            content.MediaUrl = url;
            content.UploadMediaUrl = uploadUrl;

            return content;
        }

        public async Task<ContentModel> UpdateContentAsync(ContentModel updatedContent)
        {
            if (updatedContent == null) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            var validationResult = _createUpdateContentValidator.Validate(updatedContent, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);
            updatedContent.MediaUrl = null;
            updatedContent.DateUpdated = DateTime.UtcNow;

            var content = await UpdateModelAsync(updatedContent);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType);
            string uploadUrl = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, PUT, content.MediaType);
            content.MediaUrl = url;
            content.UploadMediaUrl = uploadUrl;

            return content;
        }

        public List<ContentModel> UpdateContents(List<ContentModel>? updatedContents)
        {
            if (updatedContents == null || updatedContents.Count == 0) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            List<ContentModel> result = new();
            foreach (var content in updatedContents)
            {
                var validationResult = _createUpdateContentValidator.Validate(content, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                content.DateUpdated = DateTime.UtcNow;

                result.Add(content);
            }

            var contents = UpdateModels(result);
            contents.ForEach(c => c.MediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName, GET, c.MediaType));
            contents.ForEach(c => c.UploadMediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName, PUT, c.MediaType));

            return contents;
        }

        public async Task<List<ContentModel>> UpdateContentsAsync(List<ContentModel>? updatedContents)
        {
            if (updatedContents == null || updatedContents.Count == 0) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            List<ContentModel> result = new();
            foreach (var content in updatedContents)
            {
                var validationResult = _createUpdateContentValidator.Validate(content, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                content.DateUpdated = DateTime.UtcNow;

                result.Add(content);
            }

            var contents = await UpdateModelsAsync(result);
            contents.ForEach(c => c.MediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName, GET, c.MediaType));
            contents.ForEach(c => c.UploadMediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName, PUT, c.MediaType));

            return contents;
        }

        public ContentModel DeleteContent(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.ContentIdEmpty);
            var validationModel = new ContentIdValidationModel(id);
            var validationResult = _deleteGetContentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id);

            var content = DeleteModel(filter);
            _mediaService.DeleteMedia(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName);

            return content;
        }

        public async Task<ContentModel> DeleteContentAsync(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.ContentIdEmpty);
            var validationModel = new ContentIdValidationModel(id);
            var validationResult = _deleteGetContentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id);

            var content = await DeleteModelAsync(filter);
            _mediaService.DeleteMedia(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName);

            return content;
        }

        public List<ContentModel> DeleteContents(List<string>? ids)
        {
            if (ids == null || ids.Count == 0) throw new InstaBadRequestException(ApplicationConstants.IdsEmpty);
            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, ids.FirstOrDefault());
            bool firstId = true;
            foreach (var id in ids)
            {
                var validationResult = _deleteGetContentValidator.Validate(new ContentIdValidationModel(id), Options => Options.IncludeRuleSets(ApplicationConstants.Delete));
                ThrowExceptions(validationResult);

                if (firstId)
                    filter |= Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id);
                firstId = false;
            }

            var content = DeleteModels(filter);
            content.ForEach(c => _mediaService.DeleteMedia(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName));

            return content;
        }

        public async Task<List<ContentModel>> DeleteContentsAsync(List<string>? ids)
        {
            if (ids == null || ids.Count == 0) throw new InstaBadRequestException(ApplicationConstants.IdsEmpty);
            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, ids.FirstOrDefault());
            bool firstId = true;
            foreach (var id in ids)
            {
                var validationResult = _deleteGetContentValidator.Validate(new ContentIdValidationModel(id), Options => Options.IncludeRuleSets(ApplicationConstants.Delete));
                ThrowExceptions(validationResult);

                if (firstId)
                    filter |= Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id);
                firstId = false;
            }

            var content = await DeleteModelsAsync(filter);
            content.ForEach(c => _mediaService.DeleteMedia(GenerateKey(c.Email, c.Id, c.MediaType), ApplicationConstants.S3BucketName));

            return content;
        }

        public List<ContentModel> GetSearch(string? searchParam)
        {
            if (string.IsNullOrWhiteSpace(searchParam)) throw new InstaBadRequestException(ApplicationConstants.NoSearchParam);

            var listParams = searchParam.Split(ApplicationConstants.BlankString).ToList();
            listParams = listParams.Where(s => !string.IsNullOrWhiteSpace(s)).ToList();
            var filter = Builders<ContentModel>.Filter.Regex(p => p.Caption, new MongoDB.Bson.BsonRegularExpression(Regex.Escape(listParams.FirstOrDefault() ?? ApplicationConstants.BlankString), ApplicationConstants.I));

            bool firstIteration = true;
            foreach(var param in listParams)
            {
                if (firstIteration)
                    continue;

                filter |= Builders<ContentModel>.Filter.Regex(p => p.Caption, new MongoDB.Bson.BsonRegularExpression(Regex.Escape(listParams.FirstOrDefault() ?? ApplicationConstants.BlankString), ApplicationConstants.I));
                firstIteration = false;
            }

            var contents = GetModels(filter);

            if (contents.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NoContentFound);
            contents.ForEach(content => content.MediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType));

            return contents;
        }

        public async Task<List<ContentModel>> GetSearchAsync(string? searchParam)
        {
            if (string.IsNullOrWhiteSpace(searchParam)) throw new InstaBadRequestException(ApplicationConstants.NoSearchParam);

            var listParams = searchParam.Split(ApplicationConstants.BlankString).ToList();
            listParams = listParams.Where(s => !string.IsNullOrWhiteSpace(s)).ToList();
            var filter = Builders<ContentModel>.Filter.Regex(p => p.Caption, new MongoDB.Bson.BsonRegularExpression(Regex.Escape(listParams.FirstOrDefault() ?? ApplicationConstants.BlankString), ApplicationConstants.I));

            bool firstIteration = true;
            foreach (var param in listParams)
            {
                if (firstIteration)
                    continue;

                filter |= Builders<ContentModel>.Filter.Regex(p => p.Caption, new MongoDB.Bson.BsonRegularExpression(Regex.Escape(listParams.FirstOrDefault() ?? ApplicationConstants.BlankString), ApplicationConstants.I));
                firstIteration = false;
            }

            var contents = await GetModelsAsync(filter);

            if (contents.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NoContentFound);
            contents.ForEach(content => content.MediaUrl = _mediaService.GeneratePresignedUrl(GenerateKey(content.Email, content.Id, content.MediaType), ApplicationConstants.S3BucketName, GET, content.MediaType));

            return contents;
        }

        private static void ThrowExceptions (FluentValidation.Results.ValidationResult validationResult)
        {
            foreach (var failure in validationResult.Errors)
            {
                if (ApplicationConstants.ContentBadRequestErrorMessages.Contains(failure.ErrorMessage, StringComparer.OrdinalIgnoreCase))
                    throw new InstaBadRequestException(failure.ErrorMessage);
                else
                    throw new Exception(failure.ErrorMessage);
            }
        }

        private static string GenerateKey(string email, string id, MediaType destination)
        {
            string res;
            switch (destination)
            {
                case MediaType.ProfilePicture:
                    res = string.Format(ApplicationConstants.ProfilePictureDestination, email, id);
                    break;
                case MediaType.Photos:
                    res = string.Format(ApplicationConstants.PhotosContentDestination, email, id);
                    break;
                case MediaType.Reels:
                    res = string.Format(ApplicationConstants.ReelsContentDestination, email, id);
                    break;
                default:
                    throw new InstaInternalServerException(ApplicationConstants.AwsDestinationNotFound);
            }
            return res;
        }
    }
}