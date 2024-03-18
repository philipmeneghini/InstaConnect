using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization.UserPolicies
{

    public class UserDeleteHandler : AuthorizationHandler<UserDeleteRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserDeleteHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, UserDeleteRequirement requirement)
        {
            var claim = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Role, StringComparison.OrdinalIgnoreCase));
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            HttpRequest httpRequest = _httpContextAccessor.HttpContext!.Request;
            var query = httpRequest.Query.FirstOrDefault(q => q.Key.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase));
            string loggedInEmail = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase))!.Value;
            if (query.Value.Count == 0)
            {
                context.Fail();
                return Task.CompletedTask;
            }
            foreach (var value in query.Value)
            {
                if (value != loggedInEmail)
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
