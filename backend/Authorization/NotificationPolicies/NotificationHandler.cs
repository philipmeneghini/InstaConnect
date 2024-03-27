using Backend.Models;
using Backend.Services;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization.NotificationPolicies
{
    public class NotificationHandler : AuthorizationHandler<NotificationRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly INotificationService _notificationService;

        public NotificationHandler(IHttpContextAccessor httpContextAccessor, INotificationService notificationService)
        {
            _httpContextAccessor = httpContextAccessor;
            _notificationService = notificationService;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, NotificationRequirement requirement)
        {
            var claim = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Role, StringComparison.OrdinalIgnoreCase));
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            HttpRequest httpRequest = _httpContextAccessor.HttpContext!.Request;
            httpRequest.EnableBuffering();
            var id = httpRequest.Query.FirstOrDefault(q => q.Key.Equals(ApplicationConstants.Id, StringComparison.OrdinalIgnoreCase)).Value.FirstOrDefault();
            NotificationModel notification = _notificationService.GetNotification(id);
            var email = notification.Reciever;

            string loggedInEmail = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase))!.Value;
            if (!loggedInEmail.Equals(email, StringComparison.OrdinalIgnoreCase)
            || string.IsNullOrEmpty(email)
            || string.IsNullOrEmpty(loggedInEmail))
            {
                context.Fail();
                return Task.CompletedTask;
            }
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}


