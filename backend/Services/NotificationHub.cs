using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Util.Constants;

namespace Backend.Services
{
    public class NotificationHub : Hub, INotificationHub
    {
        private readonly IAuthService _authService;
        private IHubContext<NotificationHub> _hubContext;

        public NotificationHub(IAuthService authService, IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
            _authService = authService;
        }

        public async Task SendNotification(NotificationModel notification)
        {
            await _hubContext.Clients.Group(notification.Reciever).SendAsync(ApplicationConstants.NewMessage, notification);
        }

        public async Task SendNotifications(List<NotificationModel> notifications)
        {
            foreach(var notification in notifications)
            {
                await _hubContext.Clients.Group(notification.Reciever).SendAsync(ApplicationConstants.NewMessage, notification);
            }
        }

        public async Task<string> GetConnectionId(string? jwtToken)
        {
            string connectionId = Context.ConnectionId;

            if (string.IsNullOrWhiteSpace(jwtToken))
                return string.Empty;

            var email = _authService.VerifyToken(jwtToken).Email;

            if (!string.IsNullOrWhiteSpace(email))
                await _hubContext.Groups.AddToGroupAsync(connectionId, email);

            return connectionId;
        }
    }
}
