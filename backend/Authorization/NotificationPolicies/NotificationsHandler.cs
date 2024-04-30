using Backend.Authorization.Helpers;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization.NotificationPolicies
{
    public class NotificationsHandler : AuthorizationHandler<NotificationsRequirement>
    {
        private readonly IAuthorizationHelper _authorizationHelper;

        public NotificationsHandler(IAuthorizationHelper authorizationHelper)
        {
            _authorizationHelper = authorizationHelper;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, NotificationsRequirement requirement)
        {
            var claim = _authorizationHelper.GetRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            List<string> emails;
            _authorizationHelper.TryGetQueries(ApplicationConstants.Email, out emails);
            string loggedInEmail = _authorizationHelper.GetLoggedInEmail() ?? string.Empty;
            foreach (var email in emails)
            {
                if (!loggedInEmail.Equals(email, StringComparison.OrdinalIgnoreCase)
                || string.IsNullOrEmpty(email)
                || string.IsNullOrEmpty(loggedInEmail))
                {
                    context.Fail();
                    return Task.CompletedTask;
                }
            }
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}

