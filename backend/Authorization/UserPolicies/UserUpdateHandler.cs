﻿using Backend.Authorization.Helpers;
using Backend.Authorization.UserPolicies;
using Backend.Models;
using Backend.Services.Interfaces;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization
{

    public class UserUpdateHandler : AuthorizationHandler<UserUpdateRequirement>
    {
        private readonly IAuthorizationHelper<UserModel> _authorizationHelper;
        private readonly IUserService _userService;
        private readonly IUserHelper _userHelper;

        public UserUpdateHandler(IAuthorizationHelper<UserModel> authorizationHelper, 
                                 IUserService userService, 
                                 IUserHelper userHelper)
        {
            _authorizationHelper = authorizationHelper;
            _userService = userService;
            _userHelper = userHelper;
        }

        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, UserUpdateRequirement requirement)
        {
            var claim = _authorizationHelper.RetrieveRole();
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            List<UserModel> body;
            if (!_authorizationHelper.TryGetBody(out body))
            {
                context.Fail();
                return Task.CompletedTask;
            }
            string loggedInEmail = _authorizationHelper.RetrieveLoggedInEmail() ?? string.Empty;
            foreach (var input in body) 
            {
                var email = input?.Email;
                if (!loggedInEmail.Equals(email, StringComparison.OrdinalIgnoreCase)
                    || string.IsNullOrEmpty(email)
                    || string.IsNullOrEmpty(loggedInEmail))
                {
                    UserModel user = _userService.GetUser(email);

                    if (input == null || !_userHelper.CompareFollowers(loggedInEmail, input, user))
                    {
                        context.Fail();
                        return Task.CompletedTask;
                    }
                }
            }
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
