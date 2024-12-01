using Backend.Models;
using Backend.Services;

namespace Backend.Handlers.NotificationHandlers
{
    public abstract class AbstractNotificationhandler<T> where T : IInstaModel
    {
        private readonly INotificationService _notificationService;

        protected AbstractNotificationhandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        protected NotificationModel SendNotification(string reciever, string body)
        {
            return _notificationService.CreateNotification(new NotificationModel
            {
                Reciever = reciever,
                Body = body
            });
        }

        protected async Task<NotificationModel> SendNotificationAsync(string reciever, string body)
        {
            return await _notificationService.CreateNotificationAsync(new NotificationModel
            {
                Reciever = reciever,
                Body = body
            });
        }
    }
}
