using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization.NotificationPolicies
{
    public class NotificationsHandler : AuthorizationHandler<NotificationsRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NotificationsHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, NotificationsRequirement requirement)
        {
            var claim = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Role, StringComparison.OrdinalIgnoreCase));
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            HttpRequest httpRequest = _httpContextAccessor.HttpContext!.Request;
            httpRequest.EnableBuffering();
            var emails = httpRequest.Query.FirstOrDefault(q => q.Key.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase)).Value;
            string loggedInEmail = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase))!.Value;
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

