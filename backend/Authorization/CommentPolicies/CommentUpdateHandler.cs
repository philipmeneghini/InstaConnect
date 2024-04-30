using Backend.Authorization.Helpers;
using Backend.Models;
using Backend.Services.Interfaces;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization.CommentPolicies
{
    public class CommentUpdateHandler : AuthorizationHandler<CommentUpdateRequirement>
    {
        private readonly IAuthorizationHelper _authorizationHelper;
        private readonly ICommentService _commentService;
        private readonly ICommentHelper _commentHelper;

        public CommentUpdateHandler(IAuthorizationHelper authorizationHelper, 
                                    ICommentService commentService,
                                    ICommentHelper commentHelper)
        {
            _authorizationHelper = authorizationHelper;
            _commentService = commentService;
            _commentHelper = commentHelper;
        }

        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, CommentUpdateRequirement requirement)
        {
            var claim = _authorizationHelper.GetRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            var inputs = Task.Run(() => _authorizationHelper.TryGetBodyAsync<CommentModel>());
            inputs.Wait();
            List<CommentModel> body = inputs.Result;
            string loggedInEmail = _authorizationHelper.GetLoggedInEmail() ?? string.Empty;
            List<string> ids = body.Where(i => i != null && i.Email != null && i.Email != loggedInEmail)
                                                                            .Select(b => b.Id).ToList() as List<string>;
            List<CommentModel> comments = ids.Count > 0 ? _commentService.GetComments(ids, null) : new List<CommentModel>();
            foreach (var comment in comments)
            {
                CommentModel? input = body.FirstOrDefault(b => b.Id.Equals(comment.Id, StringComparison.OrdinalIgnoreCase));
                if (comment == null || input == null || !_commentHelper.CompareLikes(loggedInEmail, input, comment))
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
