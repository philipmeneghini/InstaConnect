using Backend.Authorization.Helpers;
using Backend.Models;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization.ContentPolicies
{

    public class ContentCreateHandler : AuthorizationHandler<ContentCreateRequirement>
    {
        private readonly IAuthorizationHelper _authorizationHelper;

        public ContentCreateHandler(IAuthorizationHelper authorizationHelper, IHttpContextAccessor httpContextAccessor)
        {
            _authorizationHelper = authorizationHelper;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, ContentCreateRequirement requirement)
        {
            var claim = _authorizationHelper.GetRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            var inputs = Task.Run(() => _authorizationHelper.TryGetBodyAsync<ContentModel>());
            inputs.Wait();
            var body = inputs.Result;
            string loggedInEmail = _authorizationHelper.GetLoggedInEmail() ?? string.Empty;
            foreach (var input in body)
            {
                string email = input.Email;
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