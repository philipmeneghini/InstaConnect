using Backend.Models;

namespace Backend.Services
{
    public interface INotificationService
    {
        public NotificationModel GetNotification(string? id);
        public Task<NotificationModel> GetNotificationAsync(string? id);

        public List<NotificationModel> GetNotifications(string? email);
        public Task<List<NotificationModel>> GetNotificationsAsync(string? email);

        public NotificationModel UpdateNotification(NotificationModel? notification);
        public Task<NotificationModel> UpdateNotificationAsync(NotificationModel? notification);

        public List<NotificationModel> UpdateNotifications(List<NotificationModel>? notifications);
        public Task<List<NotificationModel>> UpdateNotificationsAsync(List<NotificationModel>? notifications);

        public NotificationModel CreateNotification(NotificationModel? notification);
        public Task<NotificationModel> CreateNotificationAsync(NotificationModel? notification);

        public List<NotificationModel> CreateNotifications(List<NotificationModel>? notifications);
        public Task<List<NotificationModel>> CreateNotificationsAsync(List<NotificationModel>? notifications);

        public NotificationModel DeleteNotification(string? id);
        public Task<NotificationModel> DeleteNotificationAsync(string? id);

        public List<NotificationModel> DeleteNotifications(string? email);
        public Task<List<NotificationModel>> DeleteNotificationsAsync(string? email);
    }
}
