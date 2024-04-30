using Backend.Authorization.Helpers;
using Backend.Models;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization.UserPolicies
{

    public class UserDeleteHandler : AuthorizationHandler<UserDeleteRequirement>
    {

        private readonly IAuthorizationHelper _authorizationHelper;

        public UserDeleteHandler(IAuthorizationHelper authorizationHelper)
        {
            _authorizationHelper = authorizationHelper;
        }

        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, UserDeleteRequirement requirement)
        {
            var claim = _authorizationHelper.GetRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            List<string> query;
            if(!_authorizationHelper.TryGetQueries(ApplicationConstants.Email, out query))
            {
                context.Fail();
                return Task.CompletedTask;
            }
            string loggedInEmail = _authorizationHelper.GetLoggedInEmail() ?? string.Empty;
            
            foreach (var value in query)
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
