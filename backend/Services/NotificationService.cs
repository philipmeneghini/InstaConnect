using Backend.Models;
using Backend.Models.Config;
using Backend.Models.Validation;
using FluentValidation;
using InstaConnect.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Util.Constants;
using Util.Exceptions;

namespace Backend.Services
{
    public class NotificationService : Repository<NotificationModel>, INotificationService
    {
        private readonly INotificationHub _notificationHub;
        private readonly IValidator<UserEmailValidationModel> _emailValidator;
        private readonly IValidator<NotificationModel> _notificationValidator;

        public NotificationService(INotificationHub notificationHub,
                                   IValidator<NotificationModel> notificationValidator, 
                                   IValidator<UserEmailValidationModel> emailValidator,
                                   IOptions<MongoSettings<NotificationModel>> settings) : base(settings)
        {
            _notificationHub = notificationHub;
            _emailValidator = emailValidator;
            _notificationValidator = notificationValidator;
        }

        public NotificationModel GetNotification(string? id)
        {
            if (string.IsNullOrWhiteSpace(id)) throw new InstaBadRequestException(ApplicationConstants.NotificationIdEmpty);
            var filter = Builders<NotificationModel>.Filter.Eq(ApplicationConstants.Id, id);
            return GetModel(filter);
        }

        public async Task<NotificationModel> GetNotificationAsync(string? id)
        {
            if (string.IsNullOrWhiteSpace(id)) throw new InstaBadRequestException(ApplicationConstants.NotificationIdEmpty);
            var filter = Builders<NotificationModel>.Filter.Eq(ApplicationConstants.Id, id);
            return await GetModelAsync(filter);
        }

        public List<NotificationModel> GetNotifications(string? email)
        {
            var validationModel = new UserEmailValidationModel(email);
            var validationResult = _emailValidator.Validate(validationModel);
            ThrowExceptions(validationResult);

            var filter = Builders<NotificationModel>.Filter.Eq(ApplicationConstants.Reciever, email);

            return GetModels(filter);
        }

        public async Task<List<NotificationModel>> GetNotificationsAsync(string? email)
        {
            var validationModel = new UserEmailValidationModel(email);
            var validationResult = _emailValidator.Validate(validationModel);
            ThrowExceptions(validationResult);

            var filter = Builders<NotificationModel>.Filter.Eq(ApplicationConstants.Reciever, email);

            return await GetModelsAsync(filter);
        }

        public NotificationModel UpdateNotification(NotificationModel? notification)
        {
            if (notification == null) throw new InstaBadRequestException(ApplicationConstants.NoNotification);
            var validationResult = _notificationValidator.Validate(notification, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);

            var res = UpdateModel(notification);
            if (!string.IsNullOrWhiteSpace(notification.Reciever))
                _notificationHub.SendNotification(notification);

            return res;
        }

        public async Task<NotificationModel> UpdateNotificationAsync(NotificationModel? notification)
        {
            if (notification == null) throw new InstaBadRequestException(ApplicationConstants.NoNotification);
            var validationResult = _notificationValidator.Validate(notification, options => options.IncludeRuleSets(ApplicationConstants.Update));
            ThrowExceptions(validationResult);

            var res = await UpdateModelAsync(notification);
            if (!string.IsNullOrWhiteSpace(notification.Reciever))
                await _notificationHub.SendNotification(notification);

            return res;
        }

        public List<NotificationModel> UpdateNotifications(List<NotificationModel>? notifications)
        {
            if (notifications == null) throw new InstaBadRequestException(ApplicationConstants.NoNotification);
            foreach(var notification in notifications)
            {
                var validationResult = _notificationValidator.Validate(notification, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);
            }

            var res = UpdateModels(notifications);
            foreach(var notification in notifications)
            {
                if (!string.IsNullOrWhiteSpace(notification.Reciever))
                    _notificationHub.SendNotification(notification);
            }

            return res;
        }

        public async Task<List<NotificationModel>> UpdateNotificationsAsync(List<NotificationModel>? notifications)
        {
            if (notifications == null) throw new InstaBadRequestException(ApplicationConstants.NoNotification);
            foreach (var notification in notifications)
            {
                var validationResult = _notificationValidator.Validate(notification, options => options.IncludeRuleSets(ApplicationConstants.Update));
                ThrowExceptions(validationResult);
            }

            var res = await UpdateModelsAsync(notifications);
            foreach (var notification in notifications)
            {
                if (!string.IsNullOrWhiteSpace(notification.Reciever))
                    await _notificationHub.SendNotification(notification);
            }

            return res;
        }

        public NotificationModel CreateNotification(NotificationModel? notification)
        {
            if (notification == null) throw new InstaBadRequestException(ApplicationConstants.NoNotification);
            var validationResult = _notificationValidator.Validate(notification, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);

            var res = CreateModel(notification);
            _notificationHub.SendNotification(res);
            return res;
        }

        public async Task<NotificationModel> CreateNotificationAsync(NotificationModel? notification)
        {
            if (notification == null) throw new InstaBadRequestException(ApplicationConstants.NoNotification);
            var validationResult = _notificationValidator.Validate(notification, options => options.IncludeRuleSets(ApplicationConstants.Create));
            ThrowExceptions(validationResult);

            var res = await CreateModelAsync(notification);
            await _notificationHub.SendNotification(res);
            return res;
        }

        public List<NotificationModel> CreateNotifications(List<NotificationModel>? notifications)
        {
            if (notifications == null || notifications.Count == 0) throw new InstaBadRequestException(ApplicationConstants.NoNotification);
            foreach(var notification in notifications)
            {
                var validationResult = _notificationValidator.Validate(notification, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);
            }

            var res = CreateModels(notifications);
            _notificationHub.SendNotifications(res);
            return res;
        }
        public async Task<List<NotificationModel>> CreateNotificationsAsync(List<NotificationModel>? notifications)
        {
            if (notifications == null || notifications.Count == 0) throw new InstaBadRequestException(ApplicationConstants.NoNotification);
            foreach (var notification in notifications)
            {
                var validationResult = _notificationValidator.Validate(notification, options => options.IncludeRuleSets(ApplicationConstants.Create));
                ThrowExceptions(validationResult);
            }

            var res = await CreateModelsAsync(notifications);
            await _notificationHub.SendNotifications(res);
            return res;
        }

        public NotificationModel DeleteNotification(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.NotificationIdEmpty);

            var filter = Builders<NotificationModel>.Filter.Eq(ApplicationConstants.Id, id);
            return DeleteModel(filter);
        }

        public async Task<NotificationModel> DeleteNotificationAsync(string? id)
        {
            if (string.IsNullOrEmpty(id)) throw new InstaBadRequestException(ApplicationConstants.NotificationIdEmpty);

            var filter = Builders<NotificationModel>.Filter.Eq(ApplicationConstants.Id, id);
            return await DeleteModelAsync(filter);
        }

        public List<NotificationModel> DeleteNotifications(string? email)
        {
            var validatorModel = new UserEmailValidationModel(email);
            var validationResult = _emailValidator.Validate(validatorModel);
            ThrowExceptions(validationResult);

            var filter = Builders<NotificationModel>.Filter.Eq(ApplicationConstants.Reciever, email);
            return DeleteModels(filter);
        }

        public async Task<List<NotificationModel>> DeleteNotificationsAsync(string? email)
        {
            var validatorModel = new UserEmailValidationModel(email);
            var validationResult = _emailValidator.Validate(validatorModel);
            ThrowExceptions(validationResult);

            var filter = Builders<NotificationModel>.Filter.Eq(ApplicationConstants.Reciever, email);
            return await DeleteModelsAsync(filter);
        }

        private void ThrowExceptions(FluentValidation.Results.ValidationResult validationResult)
        {
            foreach (var failure in validationResult.Errors)
            {
                if (ApplicationConstants.UserBadRequestErrorMessages.Contains(failure.ErrorMessage, StringComparer.OrdinalIgnoreCase))
                    throw new InstaBadRequestException(failure.ErrorMessage);
                else
                    throw new Exception(failure.ErrorMessage);
            }
        }
    }
}
