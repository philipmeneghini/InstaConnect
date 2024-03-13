using Microsoft.AspNetCore.SignalR;

namespace Backend.Services
{
    public class NotificationHub : Hub, INotificationHub
    {
        public async Task SendNotification(string user, string type)
        {
            await Clients.User(user).SendAsync("newMessage", user, type);
        }
    }
}
