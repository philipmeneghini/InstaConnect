using Backend.Authorization.Helpers;
using Backend.Models;
using Backend.Services;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization.NotificationPolicies
{
    public class NotificationHandler : AuthorizationHandler<NotificationRequirement>
    {
        private readonly IAuthorizationHelper _authorizationHelper;
        private readonly INotificationService _notificationService;

        public NotificationHandler(IHttpContextAccessor httpContextAccessor, IAuthorizationHelper authorizationHelper, INotificationService notificationService)
        {
            _authorizationHelper = authorizationHelper;
            _notificationService = notificationService;
        }

        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, NotificationRequirement requirement)
        {
            var claim = _authorizationHelper.GetRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            List<string> ids;
            _authorizationHelper.TryGetQueries(ApplicationConstants.Id, out ids);
            var id = ids.FirstOrDefault();
            NotificationModel notification = _notificationService.GetNotification(id);
            var email = notification.Reciever;

            string loggedInEmail = _authorizationHelper.GetLoggedInEmail() ?? string.Empty;
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


