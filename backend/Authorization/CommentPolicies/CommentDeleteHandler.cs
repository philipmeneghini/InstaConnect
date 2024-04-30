using Backend.Authorization.Helpers;
using Backend.Models;
using Backend.Services.Interfaces;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization.CommentPolicies
{

    public class CommentDeleteHandler : AuthorizationHandler<CommentDeleteRequirement>
    {
        private readonly IAuthorizationHelper _authorizationHelper;
        private readonly ICommentService _commentService;
        public CommentDeleteHandler(IAuthorizationHelper authorizationHelper, 
                                    ICommentService contentService)
        {
            _authorizationHelper = authorizationHelper;
            _commentService = contentService;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, CommentDeleteRequirement requirement)
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
                List<CommentModel> comments = _commentService.GetComments(ids, null);
                if (comments.Count == 0)
                {
                    context.Fail();
                    return Task.CompletedTask;
                }
                foreach (var comment in comments)
                {
                    if (!comment.Email.Equals(loggedInEmail, StringComparison.OrdinalIgnoreCase))
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
