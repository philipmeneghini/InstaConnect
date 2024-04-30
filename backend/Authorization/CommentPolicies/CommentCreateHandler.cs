using Backend.Authorization.Helpers;
using Backend.Models;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization.CommentPolicies
{
    public class CommentCreateHandler : AuthorizationHandler<CommentCreateRequirement>
    {
        private readonly IAuthorizationHelper _authorizationHelper;

        public CommentCreateHandler(IAuthorizationHelper authorizationHelper)
        {
            _authorizationHelper = authorizationHelper;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, CommentCreateRequirement requirement)
        {
            var claim = _authorizationHelper.GetRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            var body = Task.Run(() => _authorizationHelper.TryGetBodyAsync<CommentModel>());
            body.Wait();
            var inputs = body.Result;
            string loggedInEmail = _authorizationHelper.GetLoggedInEmail() ?? string.Empty;
            foreach (var input in inputs)
            {
                var email = input?.Email;

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
