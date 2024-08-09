using Backend.Models;
using Backend.Services.Interfaces;
using MongoDB.Driver;
using Util.Constants;
using Util.Exceptions;
using FluentValidation;
using Backend.Models.Config;
using Microsoft.Extensions.Options;
using Backend.Models.Validation;
using System.Text.RegularExpressions;
using Backend.Repositories;
using Microsoft.AspNetCore.JsonPatch;
using Backend.Handlers.NotificationHandlers;
using Backend.Handlers.MediaHandlers;

namespace Backend.Services
{
    public class ContentService : Repository<ContentModel>, IContentService, ISearchService<ContentModel>
    {
        private readonly INotificationHandler<ContentModel> _notificationHandler;
        private readonly IMediaHandler<ContentModel> _mediaHandler;
        private readonly IValidator<ContentIdValidationModel> _deleteGetContentValidator;
        private readonly IValidator<ContentModel> _createUpdateContentValidator;
        private readonly IValidator<ContentEmailValidationModel> _emailContentValidator;

        public ContentService(INotificationHandler<ContentModel> notificationHandler,
                              IMediaHandler<ContentModel> mediaHandler,
                              IValidator<ContentIdValidationModel> deleteGetContentValidator, 
                              IValidator<ContentEmailValidationModel> emailContentValidator, 
                              IValidator<ContentModel> createUpdateContentValidator, 
                              IOptions<MongoSettings<ContentModel>> settings): base(settings)
        {
            _notificationHandler = notificationHandler;
            _mediaHandler = mediaHandler;
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

            _mediaHandler.AttachPresignedUrls(content);

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

            _mediaHandler.AttachPresignedUrls(content);

            return content;
        }

        public long GetNumberOfContents(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);

            FilterDefinition<ContentModel> filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Email, email);
            return GetAmount(filter);
        }

        public async Task<long> GetNumberOfContentsAsync(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);

            FilterDefinition<ContentModel> filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Email, email);
            return await GetAmountAsync(filter);
        }

        public async Task<List<ContentModel>> GetContentsAsync(List<string>? ids, List<string>? emails, DateTime? lastDate = null, int? limit = null)
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
            if (lastDate != null)
            {
                var dateFilter = Builders<ContentModel>.Filter.Lt(ApplicationConstants.DateCreated, lastDate);
                aggregatedFilter = Builders<ContentModel>.Filter.And(new FilterDefinition<ContentModel>[] { dateFilter, aggregatedFilter });
            }

            var sort = Builders<ContentModel>.Sort.Descending(c => c.DateCreated);

            var contents = await GetModelsAsync(aggregatedFilter, sort, limit);

            if (contents.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NoContentFound);

            _mediaHandler.AttachPresignedUrls(contents);

            return contents;
        }

        public List<ContentModel> GetContents(List<string>? ids, List<string>? emails, DateTime? lastDate = null, int? limit = null)
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
            if (lastDate != null)
            {
                var dateFilter = Builders<ContentModel>.Filter.Lt(ApplicationConstants.DateCreated, lastDate);
                aggregatedFilter = Builders<ContentModel>.Filter.And(new FilterDefinition<ContentModel>[] { dateFilter, aggregatedFilter });
            }

            var sort = Builders<ContentModel>.Sort.Descending(c => c.DateCreated);

            var contents = GetModels(aggregatedFilter, sort, limit);

            if (contents.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NoContentFound);

            _mediaHandler.AttachPresignedUrls(contents);

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

            _mediaHandler.AttachPresignedUrls(content, true);

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

            _mediaHandler.AttachPresignedUrls(content, true);

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

            _mediaHandler.AttachPresignedUrls(contents, true);

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

            _mediaHandler.AttachPresignedUrls(contents, true);

            return contents;
        }

        public ContentModel PatchContent(string? id, JsonPatchDocument<ContentModel>? updates)
        {
            if (updates == null) throw new InstaBadRequestException(ApplicationConstants.UpdatesEmpty);
            if (id == null) throw new InstaBadRequestException(ApplicationConstants.IdsEmpty);

            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id);
            var content = GetModel(filter);
            var originalContent = content.Clone() as ContentModel;

            updates.ApplyTo(content);
            _notificationHandler.SendNotificationsAsync(originalContent, content);

            var result = UpdateModel(content);

            _mediaHandler.AttachPresignedUrls(result);

            return result;
        }

        public async Task<ContentModel> PatchContentAsync(string? id, JsonPatchDocument<ContentModel>? updates)
        {
            if (updates == null) throw new InstaBadRequestException(ApplicationConstants.UpdatesEmpty);
            if (id == null) throw new InstaBadRequestException(ApplicationConstants.IdsEmpty);

            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, id);
            var content = await GetModelAsync(filter);
            var originalContent = content.Clone() as ContentModel;

            updates.ApplyTo(content);
            _notificationHandler.SendNotificationsAsync(originalContent, content);

            var result = await UpdateModelAsync(content);

            _mediaHandler.AttachPresignedUrls(result);

            return result;
        }

        public List<ContentModel> PatchContents(List<string>? ids, JsonPatchDocument<ContentModel>? updates)
        {
            if (updates == null) throw new InstaBadRequestException(ApplicationConstants.UpdatesEmpty);
            if (ids == null || ids.Count == 0) throw new InstaBadRequestException(ApplicationConstants.IdsEmpty);

            List<FilterDefinition<ContentModel>> filters = new List<FilterDefinition<ContentModel>>();
            ids.ForEach(i => filters.Add(Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, i)));

            var resultingFilter = Builders<ContentModel>.Filter.Or(filters);

            var contents = GetModels(resultingFilter);

            foreach(var content in contents)
            {
                var originalContent = content.Clone() as ContentModel;

                updates.ApplyTo(content);
                _notificationHandler.SendNotifications(originalContent, content);
            }

            var result = UpdateModels(contents);

            _mediaHandler.AttachPresignedUrls(result);

            return result;
        }

        public async Task<List<ContentModel>> PatchContentsAsync(List<string>? ids, JsonPatchDocument<ContentModel>? updates)
        {
            if (updates == null) throw new InstaBadRequestException(ApplicationConstants.UpdatesEmpty);
            if (ids == null || ids.Count == 0) throw new InstaBadRequestException(ApplicationConstants.IdsEmpty);

            List<FilterDefinition<ContentModel>> filters = new List<FilterDefinition<ContentModel>>();
            ids.ForEach(i => filters.Add(Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, i)));

            var resultingFilter = Builders<ContentModel>.Filter.Or(filters);

            var contents = await GetModelsAsync(resultingFilter);

            foreach (var content in contents)
            {
                var originalContent = content.Clone() as ContentModel;

                updates.ApplyTo(content);
                _notificationHandler.SendNotificationsAsync(originalContent, content);
            }

            var result = await UpdateModelsAsync(contents);

            _mediaHandler.AttachPresignedUrls(result);

            return result;
        }

        public ContentModel UpdateContent(ContentModel? updatedContent)
        {
            if (updatedContent == null) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            var validationResult = _createUpdateContentValidator.Validate(updatedContent, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);
            updatedContent.MediaUrl = null;
            updatedContent.DateUpdated = DateTime.UtcNow;

            var originalContent = GetContent(updatedContent.Id);

            var content = UpdateModel(updatedContent);

            _notificationHandler.SendNotifications(originalContent, content);

            _mediaHandler.AttachPresignedUrls(content, true);

            return content;
        }

        public async Task<ContentModel> UpdateContentAsync(ContentModel? updatedContent)
        {
            if (updatedContent == null) throw new InstaBadRequestException(ApplicationConstants.ContentEmpty);
            var validationResult = _createUpdateContentValidator.Validate(updatedContent, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);
            updatedContent.MediaUrl = null;
            updatedContent.DateUpdated = DateTime.UtcNow;

            var originalContent = await GetContentAsync(updatedContent.Id);

            var content = await UpdateModelAsync(updatedContent);

            _notificationHandler.SendNotificationsAsync(originalContent, content);

            _mediaHandler.AttachPresignedUrls(content, true);           

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

            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, updatedContents.FirstOrDefault()?.Id);
            int ind = 0;
            foreach (var updatedContent in updatedContents)
            {
                if (ind != 0)
                    filter |= Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, updatedContent.Id);

                ind++;
            }

            var originalContents = GetModels(filter);
            var contents = UpdateModels(result);

            foreach (var originalContent in originalContents)
            {
                var associatedNewContent = contents.FirstOrDefault(u => u.Id.Equals(originalContent.Id, StringComparison.OrdinalIgnoreCase));
                _notificationHandler.SendNotifications(originalContent, associatedNewContent);
            }

            _mediaHandler.AttachPresignedUrls(contents, true);

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

            var filter = Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, updatedContents.FirstOrDefault()?.Id);
            int ind = 0;
            foreach (var updatedContent in updatedContents)
            {
                if (ind != 0)
                    filter |= Builders<ContentModel>.Filter.Eq(ApplicationConstants.Id, updatedContent.Id);

                ind++;
            }

            var originalContents = await GetModelsAsync(filter);
            var contents = await UpdateModelsAsync(result);

            foreach (var originalContent in originalContents)
            {
                var associatedNewContent = contents.FirstOrDefault(u => u.Id.Equals(originalContent.Id, StringComparison.OrdinalIgnoreCase));
                _notificationHandler.SendNotificationsAsync(originalContent, associatedNewContent);
            }

            _mediaHandler.AttachPresignedUrls(contents, true);

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
            _mediaHandler.RemoveMedia(content);

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
            _mediaHandler.RemoveMedia(content);

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
            _mediaHandler.RemoveMedia(content);

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
            _mediaHandler.RemoveMedia(content);

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
            _mediaHandler.AttachPresignedUrls(contents);

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
            _mediaHandler.AttachPresignedUrls(contents);

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
    }
}