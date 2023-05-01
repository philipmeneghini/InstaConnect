using Backend.Models;
using Backend.Services.Interfaces;
using MongoDB.Driver;
using Util.Constants;
using Util.Exceptions;
using FluentValidation;
using Util.AwsDestination;
using InstaConnect.Services;
using Backend.Models.Config;
using Microsoft.Extensions.Options;

namespace Backend.Services
{
    public class UserService : MongoDbService<UserModel>, IUserService
    {
        private IMediaService _mediaService;
        private IValidator<string> _deleteGetUserValidator;
        private IValidator<UserModel> _createUpdateUserValidator;

        public UserService(IMediaService mediaService, IValidator<string> deleteGetUserValidator, IValidator<UserModel> createUpdateUserValidator, IOptions<MongoSettings<UserModel>> settings): base(settings)
        {
            _mediaService = mediaService;
            _deleteGetUserValidator = deleteGetUserValidator;
            _createUpdateUserValidator = createUpdateUserValidator;
        }

        public UserModel GetUser(string email)
        {
            if (string.IsNullOrEmpty(email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationResult = _deleteGetUserValidator.Validate(email, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var user = GetModel(email);
            string profilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = profilePictureUrl;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public async Task<UserModel> GetUserAsync(string email)
        {
            if (string.IsNullOrEmpty(email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationResult = _deleteGetUserValidator.Validate(email, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var user = await GetModelAsync(email);
            string url = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
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
            var users = await GetModelsAsync(finalFilter);

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
            var users = GetModels(finalFilter);

            if (users.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NoUsersFound);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public UserModel CreateUser(UserModel newUser)
        {
            if (newUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);

            var user = CreateModel(newUser);
            string url = _mediaService.GeneratePresignedUrl(newUser.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public async Task<UserModel> CreateUserAsync(UserModel newUser)
        {
            if (newUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);

            var user = await CreateModelAsync(newUser);
            string url = _mediaService.GeneratePresignedUrl(newUser.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public List<UserModel> CreateUsers(List<UserModel> newUsers)
        {
            if (newUsers == null || newUsers.Count ==0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var newUser in newUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                result.Add(newUser);
            }

            var users = CreateModels(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public async Task<List<UserModel>> CreateUsersAsync(List<UserModel> newUsers)
        {
            if (newUsers == null || newUsers.Count == 0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var newUser in newUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                result.Add(newUser);
            }

            var users = await CreateModelsAsync(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public UserModel UpdateUser(UserModel updatedUser)
        {
            if (updatedUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(updatedUser, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);

            var user = UpdateModel(updatedUser);
            string url = _mediaService.GeneratePresignedUrl(updatedUser.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public async Task<UserModel> UpdateUserAsync(UserModel updatedUser)
        {
            if (updatedUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(updatedUser, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);

            var user = await UpdateModelAsync(updatedUser);
            string url = _mediaService.GeneratePresignedUrl(updatedUser.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public List<UserModel> UpdateUsers(List<UserModel> updatedUsers)
        {
            if (updatedUsers == null || updatedUsers.Count == 0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var user in updatedUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(user, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                result.Add(user);
            }

            var users = UpdateModels(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public async Task<List<UserModel>> UpdateUsersAsync(List<UserModel> updatedUsers)
        {
            if (updatedUsers == null || updatedUsers.Count == 0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var user in updatedUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(user, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                result.Add(user);
            }

            var users = await UpdateModelsAsync(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName, AwsDestination.Reels));

            return users;
        }

        public UserModel DeleteUser(string email)
        {
            if (string.IsNullOrEmpty(email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationResult = _deleteGetUserValidator.Validate(email, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var user = DeleteModel(email);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, email, AwsDestination.ProfilePicture);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, email, AwsDestination.Photos);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, email, AwsDestination.Reels);


            return user;
        }

        public async Task<UserModel> DeleteUserAsync(string email)
        {
            if (string.IsNullOrEmpty(email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationResult = _deleteGetUserValidator.Validate(email, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var user = await DeleteModelAsync(email);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, email, AwsDestination.ProfilePicture);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, email, AwsDestination.Photos);
            _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, email, AwsDestination.Reels);

            return user;
        }

        public List<UserModel> DeleteUsers(FilterDefinition<UserModel> filter)
        {
            var users = DeleteModels(filter);
            foreach (var user in users)
            {
                _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, user.Email, AwsDestination.ProfilePicture);
                _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, user.Email, AwsDestination.Photos);
                _mediaService.DeleteMedia(ApplicationConstants.S3BucketName, user.Email, AwsDestination.Reels);
            }
            
            return users;
        }
        public async Task<List<UserModel>> DeleteUsersAsync(FilterDefinition<UserModel> filter)
        {
            var users = await DeleteModelsAsync(filter);
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