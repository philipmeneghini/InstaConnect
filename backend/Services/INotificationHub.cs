using Backend.Models;

namespace Backend.Services
{
    public interface INotificationHub
    {
        public Task SendNotification(NotificationModel notification);
        public Task SendNotifications(List<NotificationModel> notifications);

        public Task<string> GetConnectionId(string? jwtToken);
    }
}