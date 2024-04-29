using Backend.Authorization.Helpers;
using Backend.Models;
using Backend.Services.Interfaces;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization.ContentPolicies
{
    public class ContentUpdateHandler : AuthorizationHandler<ContentUpdateRequirement>
    {
        private readonly IAuthorizationHelper _authorizationHelper;
        private readonly IContentHelper _contentHelper;
        private readonly IContentService _contentService;

        public ContentUpdateHandler(IAuthorizationHelper authorizationHelper, 
                                    IContentHelper contentHelper, 
                                    IContentService contentService)
        {
            _authorizationHelper = authorizationHelper;
            _contentHelper = contentHelper;
            _contentService = contentService;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, ContentUpdateRequirement requirement)
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
            List<string> ids = body.Where(b => b != null && b.Email != null && b.Email != loggedInEmail)
                                   .Select(b => b.Id).ToList() as List<string>;
            List<ContentModel> contents = ids.Count > 0 ? _contentService.GetContents(ids, null) : new List<ContentModel>();
            foreach (var content in contents)
            {
                ContentModel? input = body.FirstOrDefault(b => b.Id.Equals(content.Id, StringComparison.OrdinalIgnoreCase));
                if (content == null || input == null || !_contentHelper.CompareLikes(loggedInEmail, input, content))
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

