using Backend.Authorization.Helpers;
using Backend.Authorization.UserPolicies;
using Backend.Models;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization
{

    public class UserHandler : AuthorizationHandler<UserRequirement>
    {
        private readonly IAuthorizationHelper _authorizationHelper;
        public UserHandler(IAuthorizationHelper httpContextAccessor)
        {
            _authorizationHelper = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, UserRequirement requirement)
        {
            var claim = _authorizationHelper.GetRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            var res = Task.Run(() => _authorizationHelper.TryGetBodyAsync<UserModel>());
            res.Wait();
            List<UserModel> users = res.Result;
            foreach(var user in users)
            {
                var email = user.Email;
                string loggedInEmail = _authorizationHelper.GetLoggedInEmail() ?? string.Empty;
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