using Backend.Authorization.Helpers;
using Backend.Authorization.UserPolicies;
using Backend.Models;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization
{

    public class UserHandler : AuthorizationHandler<UserRequirement>
    {
        private readonly IAuthorizationHelper<UserModel> _authorizationHelper;
        public UserHandler(IAuthorizationHelper<UserModel> httpContextAccessor)
        {
            _authorizationHelper = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, UserRequirement requirement)
        {
            var claim = _authorizationHelper.RetrieveRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            List<UserModel> users;
            if (!_authorizationHelper.TryGetBody(out users))
            {
                context.Fail();
                return Task.CompletedTask;
            }
            foreach(var user in users)
            {
                var email = user.Email;
                string loggedInEmail = _authorizationHelper.RetrieveLoggedInEmail() ?? string.Empty;
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