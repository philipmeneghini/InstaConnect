using Backend.Models;

namespace Backend.Handlers.NotificationHandlers
{
    public interface INotificationHandler<T> where T : IInstaModel
    {
        void SendNotifications(T currentModel, T updatedModel);
        void SendNotificationsAsync(T currentModel, T updatedModel);
    }
}
