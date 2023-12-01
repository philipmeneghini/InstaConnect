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

namespace Backend.Services
{
    public class UserService : Repository<UserModel>, IUserService
    {
        private IMediaService _mediaService;
        private IValidator<UserEmailValidationModel> _deleteGetUserValidator;
        private IValidator<UserModel> _createUpdateUserValidator;

        public UserService(IMediaService mediaService, IValidator<UserEmailValidationModel> deleteGetUserValidator, IValidator<UserModel> createUpdateUserValidator, IOptions<MongoSettings<UserModel>> settings): base(settings)
        {
            _mediaService = mediaService;
            _deleteGetUserValidator = deleteGetUserValidator;
            _createUpdateUserValidator = createUpdateUserValidator;
        }

        public UserModel GetUser(string? email)
        {
            if (string.IsNullOrEmpty(email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationModel = new UserEmailValidationModel(email);
            var validationResult = _deleteGetUserValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var filter = Builders<UserModel>.Filter.Eq(ApplicationConstants.Email, email);
            var user = GetModel(filter);
            string url = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
            user.ReelsUrl = reelsUrl;

            return user;
        }

        public async Task<UserModel> GetUserAsync(string? email)
        {
            if (string.IsNullOrEmpty(email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationModel = new UserEmailValidationModel(email);
            var validationResult = _deleteGetUserValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
            ThrowExceptions(validationResult);

            var filter = Builders<UserModel>.Filter.Eq(ApplicationConstants.Email, email);
            var user = await GetModelAsync(filter);
            string url = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture);
            user.ProfilePictureUrl = url;

            string photosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos);
            user.PhotosUrl = photosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
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
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels));

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
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels));

            return users;
        }

        public async Task<List<UserModel>> GetUsersAsync(List<string>? emails)
        {
            if (emails == null || emails.Count == 0) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            List<string> results = new List<string>();
            var filter = Builders<UserModel>.Filter.Eq(ApplicationConstants.Email, emails.FirstOrDefault());
            bool firstEmail = true;
            foreach (var email in emails)
            {
                var validationModel = new UserEmailValidationModel(email);
                var validationResult = _deleteGetUserValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
                ThrowExceptions(validationResult);

                if (!firstEmail)
                    filter |= Builders<UserModel>.Filter.Eq(ApplicationConstants.Email, email);
                firstEmail = false;
            }

            var users = await GetModelsAsync(filter);

            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels));

            return users;
        }

        public List<UserModel> GetUsers(List<string>? emails)
        {
            if (emails == null || emails.Count == 0) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            List<string> results = new List<string>();
            var filter = Builders<UserModel>.Filter.Eq(ApplicationConstants.Email, emails.FirstOrDefault());
            bool firstEmail = true;
            foreach (var email in emails)
            {
                var validationModel = new UserEmailValidationModel(email);
                var validationResult = _deleteGetUserValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Get));
                ThrowExceptions(validationResult);

                if (!firstEmail)
                    filter |= Builders<UserModel>.Filter.Eq(ApplicationConstants.Email, email);
                firstEmail = false;
            }

            var users = GetModels(filter);

            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels));

            return users;
        }

        public UserModel CreateUser(UserModel? newUser)
        {
            if (newUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);

            RemoveUrls(ref newUser);
            var user = CreateModel(newUser);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture);
            string uploadUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture);
            user.ProfilePictureUrl = url;
            user.UploadProfilePictureUrl = uploadUrl;

            string photosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos);
            string uploadPhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, PUT, MediaType.Photos);
            user.PhotosUrl = photosUrl;
            user.UploadPhotosUrl = uploadPhotosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
            string uploadReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels);
            user.ReelsUrl = reelsUrl;
            user.UploadReelsUrl = uploadReelsUrl;

            return user;
        }

        public async Task<UserModel> CreateUserAsync(UserModel? newUser)
        {
            if (newUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);

            RemoveUrls(ref newUser);
            var user = await CreateModelAsync(newUser);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture);
            string uploadUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture);
            user.ProfilePictureUrl = url;
            user.UploadProfilePictureUrl = uploadUrl;

            string photosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos);
            string uploadPhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, PUT, MediaType.Photos);
            user.PhotosUrl = photosUrl;
            user.UploadPhotosUrl = uploadPhotosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
            string uploadReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels);
            user.ReelsUrl = reelsUrl;
            user.UploadReelsUrl = uploadReelsUrl;

            return user;
        }

        public List<UserModel> CreateUsers(List<UserModel>? newUsers)
        {
            if (newUsers == null || newUsers.Count ==0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var newUser in newUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                result.Add(newUser);
            }

            RemoveUrls(ref result);
            var users = CreateModels(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture));
            users.ForEach(user => user.UploadProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos));
            users.ForEach(user => user.UploadPhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, PUT, MediaType.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels));
            users.ForEach(user => user.UploadReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels));

            return users;
        }

        public async Task<List<UserModel>> CreateUsersAsync(List<UserModel>? newUsers)
        {
            if (newUsers == null || newUsers.Count == 0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var newUser in newUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(newUser, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);

                result.Add(newUser);
            }

            RemoveUrls(ref result);
            var users = await CreateModelsAsync(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture));
            users.ForEach(user => user.UploadProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos));
            users.ForEach(user => user.UploadPhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, PUT, MediaType.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels));
            users.ForEach(user => user.UploadReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels));

            return users;
        }

        public UserModel UpdateUser(UserModel? updatedUser)
        {
            if (updatedUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(updatedUser, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);

            RemoveUrls(ref updatedUser);
            var user = UpdateModel(updatedUser);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture);
            string uploadUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture);
            user.ProfilePictureUrl = url;
            user.UploadProfilePictureUrl = uploadUrl;

            string photosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos);
            string uploadPhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, PUT, MediaType.Photos);
            user.PhotosUrl = photosUrl;
            user.UploadPhotosUrl = uploadPhotosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
            string uploadReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels);
            user.ReelsUrl = reelsUrl;
            user.UploadReelsUrl = uploadReelsUrl;

            return user;
        }

        public async Task<UserModel> UpdateUserAsync(UserModel? updatedUser)
        {
            if (updatedUser == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _createUpdateUserValidator.Validate(updatedUser, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);

            RemoveUrls(ref updatedUser);
            var user = await UpdateModelAsync(updatedUser);

            string url = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture);
            string uploadUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture);
            user.ProfilePictureUrl = url;
            user.UploadProfilePictureUrl = uploadUrl;

            string photosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos);
            string uploadPhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, PUT, MediaType.Photos);
            user.PhotosUrl = photosUrl;
            user.UploadPhotosUrl = uploadPhotosUrl;

            string reelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels);
            string uploadReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels);
            user.ReelsUrl = reelsUrl;
            user.UploadReelsUrl = uploadReelsUrl;

            return user;
        }

        public List<UserModel> UpdateUsers(List<UserModel>? updatedUsers)
        {
            if (updatedUsers == null || updatedUsers.Count == 0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var user in updatedUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(user, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                result.Add(user);
            }

            RemoveUrls(ref result);
            var users = UpdateModels(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture));
            users.ForEach(user => user.UploadProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos));
            users.ForEach(user => user.UploadPhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, PUT, MediaType.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels));
            users.ForEach(user => user.UploadReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels));

            return users;
        }

        public async Task<List<UserModel>> UpdateUsersAsync(List<UserModel>? updatedUsers)
        {
            if (updatedUsers == null || updatedUsers.Count == 0) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            List<UserModel> result = new List<UserModel>();
            foreach (var user in updatedUsers)
            {
                var validationResult = _createUpdateUserValidator.Validate(user, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);

                result.Add(user);
            }

            RemoveUrls(ref result);
            var users = await UpdateModelsAsync(result);
            users.ForEach(user => user.ProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, GET, MediaType.ProfilePicture));
            users.ForEach(user => user.UploadProfilePictureUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName, PUT, MediaType.ProfilePicture));
            users.ForEach(user => user.PhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, GET, MediaType.Photos));
            users.ForEach(user => user.UploadPhotosUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName, PUT, MediaType.Photos));
            users.ForEach(user => user.ReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, GET, MediaType.Reels));
            users.ForEach(user => user.UploadReelsUrl = _mediaService.GeneratePresignedUrl(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName, PUT, MediaType.Reels));

            return users;
        }

        public UserModel DeleteUser(string? email)
        {
            if (string.IsNullOrEmpty(email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationModel = new UserEmailValidationModel(email);
            var validationResult = _deleteGetUserValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var filter = Builders<UserModel>.Filter.Eq(ApplicationConstants.Email, email);
            var user = DeleteModel(filter);
            _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName);
            _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName);
            _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName);


            return user;
        }

        public async Task<UserModel> DeleteUserAsync(string? email)
        {
            if (string.IsNullOrEmpty(email)) throw new InstaBadRequestException(ApplicationConstants.EmailEmpty);
            var validationModel = new UserEmailValidationModel(email);
            var validationResult = _deleteGetUserValidator.Validate(validationModel, options => options.IncludeRuleSets(ApplicationConstants.Delete));
            ThrowExceptions(validationResult);

            var filter = Builders<UserModel>.Filter.Eq(ApplicationConstants.Email, email);
            var user = await DeleteModelAsync(filter);
            _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName);
            _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName);
            _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName);

            return user;
        }

        public List<UserModel> DeleteUsers(FilterDefinition<UserModel> filter)
        {
            var users = DeleteModels(filter);
            foreach (var user in users)
            {
                _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName);
                _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName);
                _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName);
            }
            
            return users;
        }
        public async Task<List<UserModel>> DeleteUsersAsync(FilterDefinition<UserModel> filter)
        {
            var users = await DeleteModelsAsync(filter);
            foreach (var user in users)
            {
                _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.ProfilePicture), ApplicationConstants.S3BucketName);
                _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.Photos), ApplicationConstants.S3BucketName);
                _mediaService.DeleteMedia(GenerateKey(user.Email, MediaType.Reels), ApplicationConstants.S3BucketName);
            }

            return users;
        }

        private void RemoveUrls(ref UserModel user)
        {
            if (user != null)
            {
                user.ProfilePictureUrl = null;
                user.PhotosUrl = null;
                user.ReelsUrl = null;
            }
        }

        private void RemoveUrls(ref List<UserModel> users)
        {
            foreach (var user in users)
            {
                if (user != null)
                {
                    user.ProfilePictureUrl = null;
                    user.PhotosUrl = null;
                    user.ReelsUrl = null;
                }
            }
        }

        private void ThrowExceptions (FluentValidation.Results.ValidationResult validationResult)
        {
            foreach (var failure in validationResult.Errors)
            {
                if (ApplicationConstants.UserBadRequestErrorMessages.Contains(failure.ErrorMessage, StringComparer.OrdinalIgnoreCase))
                    throw new InstaBadRequestException(failure.ErrorMessage);
                else
                    throw new Exception(failure.ErrorMessage);
            }
        }

        private string GenerateKey(string id, MediaType destination)
        {
            string res = string.Empty;
            switch (destination)
            {
                case MediaType.ProfilePicture:
                    res = string.Format(ApplicationConstants.ProfilePictureDestination, id);
                    break;
                case MediaType.Photos:
                    res = string.Format(ApplicationConstants.PhotosDestination, id);
                    break;
                case MediaType.Reels:
                    res = string.Format(ApplicationConstants.ReelsDestination, id);
                    break;
                default:
                    throw new InstaInternalServerException(ApplicationConstants.AwsDestinationNotFound);
            }
            return res;
        }
    }
}