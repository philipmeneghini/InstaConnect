using Backend.Authorization.Helpers;
using Backend.Models;
using Backend.Services.Interfaces;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization.ContentPolicies
{

    public class ContentDeleteHandler : AuthorizationHandler<ContentDeleteRequirement>
    {
        private readonly IAuthorizationHelper _authorizationHelper;
        private readonly IContentService _contentService;

        public ContentDeleteHandler(IAuthorizationHelper authorizationHelper, IContentService contentService)
        {
            _authorizationHelper = authorizationHelper;
            _contentService = contentService;
        }

        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, ContentDeleteRequirement requirement)
        {
            var claim = _authorizationHelper.GetRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            List<string> ids;
            _authorizationHelper.TryGetQueries(ApplicationConstants.Id, out ids);
            string loggedInEmail = _authorizationHelper.GetLoggedInEmail() ?? string.Empty;
            try
            {
                List<ContentModel> contents = _contentService.GetContents(ids, null);
                if (contents.Count == 0)
                {
                    context.Fail();
                    return Task.CompletedTask;
                }
                foreach (var content in contents)
                {
                    if (!content.Email.Equals(loggedInEmail, StringComparison.OrdinalIgnoreCase))
                    {
                        context.Fail();
                        return Task.CompletedTask;
                    }
                }
            }
            catch
            {
                context.Fail();
                return Task.CompletedTask;
            }
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
