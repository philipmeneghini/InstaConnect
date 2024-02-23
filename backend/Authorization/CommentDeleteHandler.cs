using Backend.Models;
using Backend.Services.Interfaces;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization
{

    public class CommentDeleteHandler : AuthorizationHandler<CommentDeleteRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICommentService _commentService;
        public CommentDeleteHandler(IHttpContextAccessor httpContextAccessor, ICommentService contentService)
        {
            _httpContextAccessor = httpContextAccessor;
            _commentService = contentService;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, CommentDeleteRequirement requirement)
        {
            var claim = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Role, StringComparison.OrdinalIgnoreCase));
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            HttpRequest httpRequest = _httpContextAccessor.HttpContext!.Request;
            var query = httpRequest.Query.FirstOrDefault(q => q.Key.Equals(ApplicationConstants.Id, StringComparison.OrdinalIgnoreCase));
            string loggedInEmail = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase))!.Value;
            List<string> ids = query.Value.Where(v => !string.IsNullOrWhiteSpace(v)).ToList();
            try
            {
                List<CommentModel> comments = _commentService.GetComments(ids);
                if (comments.Count == 0)
                {
                    context.Fail();
                    return Task.CompletedTask;
                }
                foreach(var comment in comments)
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
