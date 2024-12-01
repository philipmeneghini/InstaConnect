using Backend.Models;
using Backend.Services;
using Util.Constants;

namespace Backend.Handlers.NotificationHandlers
{
    public class ContentNotificationHandler : AbstractNotificationhandler<ContentModel>, INotificationHandler<ContentModel>
    {
        public ContentNotificationHandler(INotificationService notificationService) : base(notificationService)
        {
        }

        public void SendNotifications(ContentModel originalContent, ContentModel updatedContent)
        {
            if (updatedContent?.Likes?.Count > originalContent?.Likes?.Count)
            {
                var newLike = updatedContent?.Likes?.FirstOrDefault(u => !originalContent.Likes.Contains(u));
                SendNotification(originalContent.Email, string.Format(ApplicationConstants.LikedPostNotification, newLike, originalContent.Id));
            }
        }

        public async void SendNotificationsAsync(ContentModel originalContent, ContentModel updatedContent)
        {
            if (updatedContent?.Likes?.Count > originalContent?.Likes?.Count)
            {
                var newLike = updatedContent?.Likes?.FirstOrDefault(u => !originalContent.Likes.Contains(u));
                await SendNotificationAsync(originalContent.Email, string.Format(ApplicationConstants.LikedPostNotification, newLike, originalContent.Id));
            }
        }
    }
}
