using Backend.Models;
using Backend.Services.Interfaces;
using MongoDB.Driver;
using Util.Constants;
using Util.Exceptions;
using FluentValidation;
using InstaConnect.Services;
using Backend.Models.Config;
using Microsoft.Extensions.Options;
using Backend.Models.Validation;
using System.Collections.Generic;
using System;

namespace Backend.Services
{
    public class CommentService : Repository<CommentModel>, ICommentService
    {
        private readonly IValidator<ContentIdValidationModel> _contentIdValidator;
        private readonly IValidator<UserEmailValidationModel> _commentEmailValidator;
        private readonly IValidator<CommentModel> _createUpdateCommentValidator;
        private readonly IValidator<CommentIdValidationModel> _getDeleteCommentValidator;

        public CommentService(IValidator<ContentIdValidationModel> contentIdValidator, 
                              IValidator<UserEmailValidationModel> commentEmailValidator, 
                              IValidator<CommentModel> createUpdateCommentValidator, 
                              IValidator<CommentIdValidationModel> getDeleteCommentValidator, 
                              IOptions<MongoSettings<CommentModel>> settings): base(settings)
        {
            _contentIdValidator = contentIdValidator;
            _commentEmailValidator = commentEmailValidator;
            _createUpdateCommentValidator = createUpdateCommentValidator;
            _getDeleteCommentValidator = getDeleteCommentValidator;
        }

        public CommentModel GetComment(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.CommentIdEmpty);
            var validationModel = new CommentIdValidationModel(id);
            var validationResult = _getDeleteCommentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var filter = Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, id);
            var content = GetModel(filter);

            return content;
        }

        public async Task<CommentModel> GetCommentAsync(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.CommentIdEmpty);
            var validationModel = new CommentIdValidationModel(id);
            var validationResult = _getDeleteCommentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var filter = Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, id);
            var content = await GetModelAsync(filter);

            return content;
        }

        public async Task<List<CommentModel>> GetCommentsAsync(List<string>? ids, List<string>? contentIds, int? index = null, int? limit = null)
        {
            if ((ids == null || ids.Count == 0)
              && (contentIds == null || contentIds.Count == 0))
            {
                throw new InstaBadRequestException(ApplicationConstants.ContentCommentIdsEmpty);
            }

            List<FilterDefinition<CommentModel>> filters = new List<FilterDefinition<CommentModel>>() { };
            if (ids != null && ids.Count != 0)
            {
                foreach (var id in ids)
                {
                    if (!string.IsNullOrWhiteSpace(id))
                        filters.Add(Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, id));
                }
            }

            if (contentIds != null && contentIds.Count != 0)
            {
                foreach (var contentId in contentIds)
                {
                    if (string.IsNullOrWhiteSpace(contentId)) throw new InstaBadRequestException(ApplicationConstants.ContentIdEmpty);
                    var validationModel = new ContentIdValidationModel(contentId);
                    var validationResult = _contentIdValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
                    ThrowExceptions(validationResult);

                    filters.Add(Builders<CommentModel>.Filter.Eq(ApplicationConstants.ContentId, contentId));
                }
            }

            var aggregatedFilter = Builders<CommentModel>.Filter.Or(filters);
            var sort = Builders<CommentModel>.Sort.Descending(c => c.DateCreated);
            var lazyLoad = (limit == null ? null : new LazyLoadModel(index, limit ?? 0));
            var comments = await GetModelsAsync(aggregatedFilter, sort, lazyLoad);
            return comments;
        }

        public List<CommentModel> GetComments(List<string>? ids, List<string>? contentIds, int? index = null, int? limit = null)
        {
            if ((ids == null || ids.Count == 0)
               && (contentIds == null || contentIds.Count == 0))
            {
                throw new InstaBadRequestException(ApplicationConstants.ContentCommentIdsEmpty);
            }

            List<FilterDefinition<CommentModel>> filters = new List<FilterDefinition<CommentModel>>() { };
            if (ids != null && ids.Count != 0)
            {
                foreach (var id in ids)
                {
                    if (!string.IsNullOrWhiteSpace(id))
                        filters.Add(Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, id));
                }
            }
            
            if (contentIds != null && contentIds.Count != 0)
            {
                foreach (var contentId in contentIds)
                {
                    if (string.IsNullOrWhiteSpace(contentId)) throw new InstaBadRequestException(ApplicationConstants.ContentIdEmpty);
                    var validationModel = new ContentIdValidationModel(contentId);
                    var validationResult = _contentIdValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
                    ThrowExceptions(validationResult);

                    filters.Add(Builders<CommentModel>.Filter.Eq(ApplicationConstants.ContentId, contentId));
                }
            }

            var aggregatedFilter = Builders<CommentModel>.Filter.Or(filters);
            var sort = Builders<CommentModel>.Sort.Descending(c => c.DateCreated);
            var lazyLoad = (limit == null ? null : new LazyLoadModel(index, limit ?? 0));

            var comments = GetModels(aggregatedFilter, sort, lazyLoad);
            return comments;
        }

        public CommentModel CreateComment(CommentModel? newComment)
        {
            if (newComment == null) throw new InstaBadRequestException(ApplicationConstants.CommentEmpty);
            var validationResult = _createUpdateCommentValidator.Validate(newComment, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);
            newComment.DateCreated = DateTime.UtcNow;
            newComment.DateUpdated = DateTime.UtcNow;
            if (newComment.Likes == null)
                newComment.Likes = new HashSet<string>();

            var comment = CreateModel(newComment);

            return comment;
        }

        public async Task<CommentModel> CreateCommentAsync(CommentModel? newComment)
        {
            if (newComment == null) throw new InstaBadRequestException(ApplicationConstants.CommentEmpty);
            var validationResult = _createUpdateCommentValidator.Validate(newComment, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);
            newComment.DateCreated = DateTime.UtcNow;
            newComment.DateUpdated = DateTime.UtcNow;
            if (newComment.Likes == null)
                newComment.Likes = new HashSet<string>();

            var comment = await CreateModelAsync(newComment);

            return comment;
        }

        public List<CommentModel> CreateComments(List<CommentModel>? newComments)
        {
            if (newComments == null || newComments.Count ==0) throw new InstaBadRequestException(ApplicationConstants.CommentEmpty);
            List<CommentModel> result = new();
            foreach (var newComment in newComments)
            {
                var validationResult = _createUpdateCommentValidator.Validate(newComment, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                newComment.DateCreated = DateTime.UtcNow;
                newComment.DateUpdated = DateTime.UtcNow;
                if (newComment.Likes == null)
                    newComment.Likes = new HashSet<string>();

                result.Add(newComment);
            }
            var comments = CreateModels(result);

            return comments;
        }

        public async Task<List<CommentModel>> CreateCommentsAsync(List<CommentModel>? newComments)
        {
            if (newComments == null || newComments.Count == 0) throw new InstaBadRequestException(ApplicationConstants.CommentEmpty);
            List<CommentModel> result = new();
            foreach (var newComment in newComments)
            {
                var validationResult = _createUpdateCommentValidator.Validate(newComment, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                newComment.DateCreated = DateTime.UtcNow;
                newComment.DateUpdated = DateTime.UtcNow;
                if (newComment.Likes == null)
                    newComment.Likes = new HashSet<string>();

                result.Add(newComment);
            }
            var comments = await CreateModelsAsync(result);

            return comments;
        }

        public CommentModel UpdateComment(CommentModel? updatedComment)
        {
            if (updatedComment == null) throw new InstaBadRequestException(ApplicationConstants.CommentEmpty);
            var validationResult = _createUpdateCommentValidator.Validate(updatedComment, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);
            updatedComment.DateUpdated = DateTime.UtcNow;

            var comment = UpdateModel(updatedComment);

            return comment;
        }

        public async Task<CommentModel> UpdateCommentAsync(CommentModel? updatedComment)
        {
            if (updatedComment == null) throw new InstaBadRequestException(ApplicationConstants.CommentEmpty);
            var validationResult = _createUpdateCommentValidator.Validate(updatedComment, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);
            updatedComment.DateUpdated = DateTime.UtcNow;

            var comment = await UpdateModelAsync(updatedComment);

            return comment;
        }

        public List<CommentModel> UpdateComments(List<CommentModel>? updatedComments)
        {
            if (updatedComments == null || updatedComments.Count == 0) throw new InstaBadRequestException(ApplicationConstants.CommentEmpty);
            List<CommentModel> result = new();
            foreach (var comment in updatedComments)
            {
                var validationResult = _createUpdateCommentValidator.Validate(comment, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                comment.DateUpdated = DateTime.UtcNow;

                result.Add(comment);
            }

            var comments = UpdateModels(result);

            return comments;
        }

        public async Task<List<CommentModel>> UpdateCommentsAsync(List<CommentModel>? updatedComments)
        {
            if (updatedComments == null || updatedComments.Count == 0) throw new InstaBadRequestException(ApplicationConstants.CommentEmpty);
            List<CommentModel> result = new();
            foreach (var comment in updatedComments)
            {
                var validationResult = _createUpdateCommentValidator.Validate(comment, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                comment.DateUpdated = DateTime.UtcNow;

                result.Add(comment);
            }

            var comments = await UpdateModelsAsync(result);

            return comments;
        }

        public CommentModel DeleteComment(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.CommentIdEmpty);
            var validationModel = new CommentIdValidationModel(id);
            var validationResult = _getDeleteCommentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var filter = Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, id);

            var comment = DeleteModel(filter);

            return comment;
        }

        public async Task<CommentModel> DeleteCommentAsync(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.CommentIdEmpty);
            var validationModel = new CommentIdValidationModel(id);
            var validationResult = _getDeleteCommentValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var filter = Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, id);

            var comment = await DeleteModelAsync(filter);

            return comment;
        }

        public List<CommentModel> DeleteComments(List<string>? ids)
        {
            if (ids == null || ids.Count == 0) throw new InstaBadRequestException(ApplicationConstants.IdsEmpty);
            var filter = Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, ids.FirstOrDefault());
            bool firstId = true;
            foreach (var id in ids)
            {
                var validationResult = _getDeleteCommentValidator.Validate(new CommentIdValidationModel(id), Options => Options.IncludeRuleSets(ApplicationConstants.Delete));
                ThrowExceptions(validationResult);

                if (firstId)
                    filter |= Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, id);
                firstId = false;
            }

            var comments = DeleteModels(filter);

            return comments;
        }

        public async Task<List<CommentModel>> DeleteCommentsAsync(List<string>? ids)
        {
            if (ids == null || ids.Count == 0) throw new InstaBadRequestException(ApplicationConstants.IdsEmpty);
            var filter = Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, ids.FirstOrDefault());
            bool firstId = true;
            foreach (var id in ids)
            {
                var validationResult = _getDeleteCommentValidator.Validate(new CommentIdValidationModel(id), Options => Options.IncludeRuleSets(ApplicationConstants.Delete));
                ThrowExceptions(validationResult);

                if (firstId)
                    filter |= Builders<CommentModel>.Filter.Eq(ApplicationConstants.Id, id);
                firstId = false;
            }

            var comments = await DeleteModelsAsync(filter);

            return comments;
        }

        private static void ThrowExceptions (FluentValidation.Results.ValidationResult validationResult)
        {
            foreach (var failure in validationResult.Errors)
            {
                if (ApplicationConstants.CommentBadRequestErrorMessages.Contains(failure.ErrorMessage, StringComparer.OrdinalIgnoreCase))
                    throw new InstaBadRequestException(failure.ErrorMessage);
                else
                    throw new Exception(failure.ErrorMessage);
            }
        }
    }
}