using Backend.Models;
using Backend.Services;
using Util.Constants;

namespace Backend.Handlers.NotificationHandlers
{
    public class UserNotificationHandler : AbstractNotificationhandler<UserModel>, INotificationHandler<UserModel>
    {
        public UserNotificationHandler(INotificationService notificationService) : base(notificationService)
        {
        }

        public void SendNotifications(UserModel originalUser, UserModel updatedUser)
        {
            if (originalUser?.Followers?.Count < updatedUser?.Followers?.Count)
            {
                var newFollower = updatedUser?.Followers?.FirstOrDefault(u => !originalUser.Followers.Contains(u));
                SendNotification(updatedUser.Email, string.Format(ApplicationConstants.NewFollowerNotification, newFollower));
            }
        }

        public async void SendNotificationsAsync(UserModel originalUser, UserModel updatedUser)
        {
            if (originalUser?.Followers?.Count < updatedUser?.Followers?.Count)
            {
                var newFollower = updatedUser?.Followers?.FirstOrDefault(u => !originalUser.Followers.Contains(u));
                await SendNotificationAsync(updatedUser.Email, string.Format(ApplicationConstants.NewFollowerNotification, newFollower));
            }
        }
    }
}
