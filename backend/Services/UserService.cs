using InstaConnect.Models;
using Backend.Interfaces;
using Backend.Services;
using MongoDB.Driver;
using Backend.Util;
using Util.Constants;
using MongoDB.Bson;
using Backend.Util.Exceptions;
using Amazon.S3;
using Amazon.Runtime;
using Amazon;
using InstaConnect.Services;
using FluentValidation;
using Backend.Validators.UserValidators;
using Backend.Models;
using Microsoft.Extensions.Options;
using FluentValidation.Results;
using System.ComponentModel.DataAnnotations;

namespace Backend.UserServices
{
    public class UserService : IUserService
    {
        private IMongoDbService<UserModel> _mongoDbService;
        private IProfilePictureService _profilePictureService;
        private IValidator<string> _getUserValidator;
        private IValidator<string> _deleteUserValidator;
        private IValidator<UserModel> _createUserValidator;
        private IValidator<UserModel> _updateUserValidator;

        public UserService(IMongoDbService<UserModel> mongoDbService, IProfilePictureService profilePictureService, IValidator<string> getUserValidator, IValidator<string> deleteUserValidator, IValidator<UserModel> createUserValidator, IValidator<UserModel> updateUserValidator)
        {
            _mongoDbService = mongoDbService;
            _profilePictureService = profilePictureService;
            _getUserValidator = getUserValidator;
            _deleteUserValidator = deleteUserValidator;
            _createUserValidator = createUserValidator;
            _updateUserValidator = updateUserValidator;
        }

        public UserModel GetModel(object email)
        {
            var validationResult = _getUserValidator.Validate((string)email);
            ThrowExceptions(validationResult);

            var user = _mongoDbService.GetModel(email);
            string url = _profilePictureService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName);
            user.profilePicture = url;

            return user;
        }

        public async Task<UserModel> GetModelAsync(object email)
        {
            var validationResult = _getUserValidator.Validate((string)email);
            ThrowExceptions(validationResult);

            var user = await _mongoDbService.GetModelAsync(email);
            string url = _profilePictureService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName);
            user.profilePicture = url;

            return user;
        }

        public List<UserModel> GetModels(FilterDefinition<UserModel> filter)
        {
            var users = _mongoDbService.GetModels(filter);

            foreach (var user in users)
            {
                string url = _profilePictureService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName);
                user.profilePicture = url;
            }

            return users;
        }
        public async Task<List<UserModel>> GetModelsAsync(FilterDefinition<UserModel> filter)
        {
            var users = await _mongoDbService.GetModelsAsync(filter);

            foreach (var user in users)
            {
                string url = _profilePictureService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName);
                user.profilePicture = url;
            }

            return users;
        }

        public async Task<List<UserModel>> GetUsersAsync(string? firstName, string? lastName, string? birthdate)
        {
            if (string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName) && string.IsNullOrEmpty(birthdate))
            {
                throw new InstaBadRequestException(ApplicationConstants.NoArgumentsPassed);
            }
            var builder = Builders<UserModel>.Filter;
            var filter = builder.Eq(p => p.FirstName ?? null,  firstName) 
                       & builder.Eq(p => p.LastName ?? null, lastName)
                       & builder.Eq(p => p.BirthDate ?? null, birthdate);
            var users = await _mongoDbService.GetModelsAsync(filter);
            if (users.Count == 0)
            {
                throw new InstaNotFoundException(ApplicationConstants.NoUsersFound);
            }
            foreach (var user in users)
            {
                user.profilePicture = _profilePictureService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName);
            }
            return users;
        }

        public List<UserModel> GetUsers(string? firstName, string? lastName, string? birthdate)
        {
            if (string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName) && string.IsNullOrEmpty(birthdate))
            {
                throw new InstaBadRequestException(ApplicationConstants.NoArgumentsPassed);
            }
            var builder = Builders<UserModel>.Filter;
            var filter = builder.Eq(p => p.FirstName ?? null, firstName)
                       & builder.Eq(p => p.LastName ?? null, lastName)
                       & builder.Eq(p => p.BirthDate ?? null, birthdate);
            var users = _mongoDbService.GetModels(filter);
            if (users.Count == 0)
            {
                throw new InstaNotFoundException(ApplicationConstants.NoUsersFound);
            }
            foreach (var user in users)
            {
                user.profilePicture = _profilePictureService.GeneratePresignedUrl(user.Email, ApplicationConstants.S3BucketName);
            }
            return users;
        }

        public UserModel CreateModel(UserModel newUser)
        {
            var validationResult = _createUserValidator.Validate(newUser);
            ThrowExceptions(validationResult);

            string url = _profilePictureService.GeneratePresignedUrl(newUser.Email, ApplicationConstants.S3BucketName);
            newUser.profilePicture = url;

            return _mongoDbService.CreateModel(newUser);
        }

        public async Task<UserModel> CreateModelAsync(UserModel newUser)
        {
            var validationResult = _createUserValidator.Validate(newUser);
            ThrowExceptions(validationResult);

            string url = _profilePictureService.GeneratePresignedUrl(newUser.Email, ApplicationConstants.S3BucketName);
            newUser.profilePicture = url;

            return await _mongoDbService.CreateModelAsync(newUser);
        }

        public List<UserModel> CreateModels(List<UserModel> newUsers)
        {
            List<UserModel> result = new List<UserModel>();
            foreach (var newUser in newUsers)
            {
                var validationResult = _createUserValidator.Validate(newUser);
                ThrowExceptions(validationResult);

                string url = _profilePictureService.GeneratePresignedUrl(newUser.Email, ApplicationConstants.S3BucketName);
                newUser.profilePicture = url;

                result.Add(newUser);
            }

            return _mongoDbService.CreateModels(result);
        }

        public async Task<List<UserModel>> CreateModelsAsync(List<UserModel> newUsers)
        {
            List<UserModel> result = new List<UserModel>();
            foreach (var newUser in newUsers)
            {
                var validationResult = _createUserValidator.Validate(newUser);
                ThrowExceptions(validationResult);

                string url = _profilePictureService.GeneratePresignedUrl(newUser.Email, ApplicationConstants.S3BucketName);
                newUser.profilePicture = url;

                result.Add(newUser);
            }

            return await _mongoDbService.CreateModelsAsync(result);
        }

        public UserModel UpdateModel(UserModel updatedUser)
        {
            var validationResult = _updateUserValidator.Validate(updatedUser);
            ThrowExceptions(validationResult);

            return _mongoDbService.UpdateModel(updatedUser);
        }

        public async Task<UserModel> UpdateModelAsync(UserModel updatedUser)
        {
            var validationResult = _updateUserValidator.Validate(updatedUser);
            ThrowExceptions(validationResult);

            return await _mongoDbService.UpdateModelAsync(updatedUser);
        }

        public List<UserModel> UpdateModels(List<UserModel> updatedUsers)
        {
            foreach (var user in updatedUsers)
            {
                var validationResult = _updateUserValidator.Validate(user);
                ThrowExceptions(validationResult);
            }

            return _mongoDbService.UpdateModels(updatedUsers);
        }

        public async Task<List<UserModel>> UpdateModelsAsync(List<UserModel> updatedUsers)
        {
            foreach (var user in updatedUsers)
            {
                var validationResult = _updateUserValidator.Validate(user);
                ThrowExceptions(validationResult);
            }

            return await _mongoDbService.UpdateModelsAsync(updatedUsers);
        }

        public UserModel? DeleteModel(object email)
        {
            var validationResult = _deleteUserValidator.Validate((string)email);
            ThrowExceptions(validationResult);

            var user = _mongoDbService.DeleteModel(email);
            _profilePictureService.DeleteProfilePicture(ApplicationConstants.S3BucketName, (string)email);

            return user;
        }

        public async Task<UserModel?> DeleteModelAsync(object email)
        {
            var validationResult = _deleteUserValidator.Validate((string)email);
            ThrowExceptions(validationResult);

            var user = _mongoDbService.DeleteModel(email);
            _profilePictureService.DeleteProfilePicture(ApplicationConstants.S3BucketName, (string)email);

            return user;
        }

        public List<UserModel> DeleteModels(FilterDefinition<UserModel> filter)
        {
            var users = _mongoDbService.DeleteModels(filter);
            foreach (var user in users)
            {
                _profilePictureService.DeleteProfilePicture(ApplicationConstants.S3BucketName, user.Email);
            }
            
            return users;
        }
        public async Task<List<UserModel>> DeleteModelsAsync(FilterDefinition<UserModel> filter)
        {
            var users = await _mongoDbService.DeleteModelsAsync(filter);
            foreach (var user in users)
            {
                _profilePictureService.DeleteProfilePicture(ApplicationConstants.S3BucketName, user.Email);
            }

            return users;
        }

        private void ThrowExceptions (FluentValidation.Results.ValidationResult validationResult)
        {
            foreach (var failure in validationResult.Errors)
            {
                if (failure.ErrorCode.Equals("400", StringComparison.OrdinalIgnoreCase))
                {
                    throw new InstaBadRequestException(failure.ErrorMessage);
                }
                else if (failure.ErrorCode.Equals("404", StringComparison.OrdinalIgnoreCase))
                {
                    throw new InstaNotFoundException(failure.ErrorMessage);
                }
                else
                {
                    throw new Exception(failure.ErrorMessage);
                }
            }
        }
    }
}