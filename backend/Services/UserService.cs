using Backend.Models;
using Backend.Services.Interfaces;
using MongoDB.Driver;
using Util.Constants;
using Util.Exceptions;
using FluentValidation;
using Util.AwsDestination;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private IMongoDbService<UserModel> _mongoDbService;
        private IMediaService _mediaService;
        private IValidator<string> _deleteGetUserValidator;
        private IValidator<UserModel> _createUpdateUserValidator;

        public UserService(IMongoDbService<UserModel> mongoDbService, IMediaService mediaService, IValidator<string> deleteGetUserValidator, IValidator<UserModel> createUpdateUserValidator)
        {
            _mongoDbService = mongoDbService;
            _mediaService = mediaService;
            _deleteGetUserValidator = deleteGetUserValidator;
            _createUpdateUserValidator = createUpdateUserValidator;
        }

        public UserModel GetModel(object email)
        {
            if (string.IsNullOrEmpty((string)email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationResult = _deleteGetUserValidator.Validate((string)email, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var user = _mongoDbService.GetModel(email);
            string profilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = profilePictureUrl;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public async Task<UserModel> GetModelAsync(object email)
        {
            if (string.IsNullOrEmpty((string)email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationResult = _deleteGetUserValidator.Validate((string)email, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var user = await _mongoDbService.GetModelAsync(email);
            string url = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public List<UserModel> GetModels(FilterDefinition<UserModel> filter)
        {
            var users = _mongoDbService.GetModels(filter);

            foreach (var user in users)
            {
                string url = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
                user.ProfilePictureUrl = url;

                string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
                user.PhotosUrl = photosUrl;

                string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
                user.ReelsUrl = reelsUrl;
            }

            return users;
        }
        public async Task<List<UserModel>> GetModelsAsync(FilterDefinition<UserModel> filter)
        {
            var users = await _mongoDbService.GetModelsAsync(filter);

            foreach (var user in users)
            {
                string url = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
                user.ProfilePictureUrl = url;

                string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
                user.PhotosUrl = photosUrl;

                string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
                user.ReelsUrl = reelsUrl;
            }

            return users;
        }

        public async Task<List<UserModel>> GetUsersAsync(string? firstName, string? lastName, string? birthdate)
        {
            var filter = Builders<UserModel>.Filter;
            var filters = new List<FilterDefinition<UserModel>>();
            if (string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName) && string.IsNullOrEmpty(birthdate))
                throw new InstaBadRequestException(ApplicationConstants.NoArgumentsPassed);
            else
            {
                if (!string.IsNullOrEmpty(firstName))
                    filters.Add(Builders<UserModel>.Filter.Eq(p => p.FirstName, firstName));
                if (!string.IsNullOrEmpty(lastName))
                    filters.Add(Builders<UserModel>.Filter.Eq(p => p.LastName, lastName));
                if (!string.IsNullOrEmpty(birthdate))
                    filters.Add(Builders<UserModel>.Filter.Eq(p => p.BirthDate, birthdate));
            }
            var finalFilter = filter.And((IEnumerable<FilterDefinition<UserModel>>)filters);
            var users = await _mongoDbService.GetModelsAsync(finalFilter);

            if (users.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NoUsersFound);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public List<UserModel> GetUsers(string? firstName, string? lastName, string? birthdate)
        {
            var filter = Builders<UserModel>.Filter;
            var filters = new List<FilterDefinition<UserModel>>();
            if (string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName) && string.IsNullOrEmpty(birthdate))
                throw new InstaBadRequestException(ApplicationConstants.NoArgumentsPassed);
            else
            {
                if (!string.IsNullOrEmpty(firstName))
                    filters.Add(Builders<UserModel>.Filter.Eq(p => p.FirstName, firstName));
                if (!string.IsNullOrEmpty(lastName))
                    filters.Add(Builders<UserModel>.Filter.Eq(p => p.LastName, lastName));
                if (!string.IsNullOrEmpty(birthdate))
                    filters.Add(Builders<UserModel>.Filter.Eq(p => p.BirthDate, birthdate));
            }
            var finalFilter = filter.And((IEnumerable<FilterDefinition<UserModel>>)filters);
            var users = _mongoDbService.GetModels(finalFilter);

            if (users.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NoUsersFound);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public UserModel CreateModel(UserModel newUser)
        {
            if (newUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);

            var user = _mongoDbService.CreateModel(newUser);
            string url = _mediaService.GeneratePresignedUrl(newUser.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public async Task<UserModel> CreateModelAsync(UserModel newUser)
        {
            if (newUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);

            var user = await _mongoDbService.CreateModelAsync(newUser);
            string url = _mediaService.GeneratePresignedUrl(newUser.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public List<UserModel> CreateModels(List<UserModel> newUsers)
        {
            if (newUsers == null || newUsers.Count ==0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var newUser in newUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                result.Add(newUser);
            }

            var users = _mongoDbService.CreateModels(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public async Task<List<UserModel>> CreateModelsAsync(List<UserModel> newUsers)
        {
            if (newUsers == null || newUsers.Count == 0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var newUser in newUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                result.Add(newUser);
            }

            var users = await _mongoDbService.CreateModelsAsync(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public UserModel UpdateModel(UserModel updatedUser)
        {
            if (updatedUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(updatedUser, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);

            var user = _mongoDbService.UpdateModel(updatedUser);
            string url = _mediaService.GeneratePresignedUrl(updatedUser.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public async Task<UserModel> UpdateModelAsync(UserModel updatedUser)
        {
            if (updatedUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(updatedUser, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);

            var user = await _mongoDbService.UpdateModelAsync(updatedUser);
            string url = _mediaService.GeneratePresignedUrl(updatedUser.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public List<UserModel> UpdateModels(List<UserModel> updatedUsers)
        {
            if (updatedUsers == null || updatedUsers.Count == 0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var user in updatedUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(user, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                result.Add(user);
            }

            var users = _mongoDbService.UpdateModels(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public async Task<List<UserModel>> UpdateModelsAsync(List<UserModel> updatedUsers)
        {
            if (updatedUsers == null || updatedUsers.Count == 0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var user in updatedUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(user, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                result.Add(user);
            }

            var users = await _mongoDbService.UpdateModelsAsync(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public UserModel DeleteModel(object email)
        {
            if (string.IsNullOrEmpty((string)email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationResult = _deleteGetUserValidator.Validate((string)email, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var user = _mongoDbService.DeleteModel(email);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, (string)email, AwsDestination.ProfilePicture);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, (string)email, AwsDestination.Photos);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, (string)email, AwsDestination.Reels);


            return user;
        }

        public async Task<UserModel> DeleteModelAsync(object email)
        {
            if (string.IsNullOrEmpty((string)email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationResult = _deleteGetUserValidator.Validate((string)email, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var user = await _mongoDbService.DeleteModelAsync(email);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, (string)email, AwsDestination.ProfilePicture);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, (string)email, AwsDestination.Photos);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, (string)email, AwsDestination.Reels);

            return user;
        }

        public List<UserModel> DeleteModels(FilterDefinition<UserModel> filter)
        {
            var users = _mongoDbService.DeleteModels(filter);
            foreach (var user in users)
            {
                _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, user.Email, AwsDestination.ProfilePicture);
                _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, user.Email, AwsDestination.Photos);
                _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, user.Email, AwsDestination.Reels);
            }
            
            return users;
        }
        public async Task<List<UserModel>> DeleteModelsAsync(FilterDefinition<UserModel> filter)
        {
            var users = await _mongoDbService.DeleteModelsAsync(filter);
            foreach (var user in users)
            {
                _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, user.Email, AwsDestination.ProfilePicture);
                _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, user.Email, AwsDestination.Photos);
                _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, user.Email, AwsDestination.Reels);
            }

            return users;
        }

        private void ThrowExceptions (FluentValidation.Results.ValidationResult validationResult)
        {
            foreach (var failure in validationResult.Errors)
            {
                if (ApplicationConstants.BadRequestErrorMessages.Contains(failure.ErrorMessage, StringComparer.OrdinalIgnoreCase))
                    throw new InstaBadRequestException(failure.ErrorMessage);
                else
                    throw new Exception(failure.ErrorMessage);
            }
        }
    }
}