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

        public async Task SendNotification(string email, string message)
        {
            await _hubContext.Clients.Group(email).SendAsync(ApplicationConstants.NewMessage, message);
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
