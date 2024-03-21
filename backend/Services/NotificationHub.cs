using Backend.Models;
using Backend.Models.Config;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Util.Constants;
using Util.Exceptions;

namespace Backend.Services
{
    public class NotificationHub : Hub, INotificationHub
    {
        private IHubContext<NotificationHub> _hubContext;
        private readonly JwtSettings _jwtSettings;

        public NotificationHub(IHubContext<NotificationHub> hubContext, 
                               IOptions<JwtSettings> jwtSettings)
        {
            _hubContext = hubContext;
            _jwtSettings = jwtSettings.Value;
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

            var email = VerifyToken(jwtToken).Email;

            if (!string.IsNullOrWhiteSpace(email))
                await _hubContext.Groups.AddToGroupAsync(connectionId, email);

            return connectionId;
        }

        public JwtModel VerifyToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                throw new InstaBadRequestException(ApplicationConstants.NoToken);
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            TokenValidationParameters validationParameters = new TokenValidationParameters()
            {
                ValidateLifetime = true,
                ValidateAudience = false,
                ValidateIssuer = false,
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtSettings.Key))
            };
            SecurityToken verifiedToken;
            try
            {
                var res = jwtTokenHandler.ValidateToken(token, validationParameters, out verifiedToken);
                var jwtModel = PopulateModel(res);
                return jwtModel;
            }
            catch (Exception ex)
            {
                throw new InstaBadRequestException(ex.Message);
            }
        }

        private JwtModel PopulateModel(ClaimsPrincipal claims)
        {
            var res = new JwtModel();
            foreach (var claim in claims.Claims)
            {
                if (claim.Type.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase))
                    res.Email = claim.Value;
                else if (claim.Type.Equals(ApplicationConstants.Name, StringComparison.OrdinalIgnoreCase))
                    res.FullName = claim.Value;
                else if (claim.Type.Equals(ApplicationConstants.DateOfBirth, StringComparison.OrdinalIgnoreCase))
                    res.BirthDate = claim.Value;
                else if (claim.Type.Equals(ApplicationConstants.Role, StringComparison.OrdinalIgnoreCase))
                    res.Role = claim.Value;
                else if (claim.Type.Equals(ApplicationConstants.Exp, StringComparison.OrdinalIgnoreCase))
                    res.Expiration = Int32.Parse(claim.Value);
            }
            return res;
        }
    }
}
