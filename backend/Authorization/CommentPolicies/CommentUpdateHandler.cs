﻿using Amazon.SimpleEmail.Model;
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

            List<CommentModel> inputs;
            _authorizationHelper.TryGetBody(out inputs);
            string loggedInEmail = _authorizationHelper.GetLoggedInEmail() ?? string.Empty;
            List<CommentModel> comments = _commentService.GetComments(inputs.Where(i => i != null && i.Email != null && i.Email != loggedInEmail)
                                                                            .Select(b => b.Id).ToList() as List<string>, null);
            foreach (var comment in comments)
            {
                CommentModel? input = inputs.FirstOrDefault(b => b.Id.Equals(comment.Id, StringComparison.OrdinalIgnoreCase));
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
