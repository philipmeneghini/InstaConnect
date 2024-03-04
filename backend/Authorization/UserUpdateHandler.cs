using Backend.Models;
using Backend.Util;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization
{

    public class UserUpdateHandler : AuthorizationHandler<UserUpdateRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserUpdateHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, UserUpdateRequirement requirement)
        {
            var claim = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Role, StringComparison.OrdinalIgnoreCase));
            if (claim != null && claim.Value.Equals(Role.Administrator.ToString()))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            HttpRequest httpRequest = _httpContextAccessor.HttpContext!.Request;
            httpRequest.EnableBuffering();
            var input = httpRequest.ReadFromJsonAsync<UserModel>().Result;
            var email = input?.Email;
            string loggedInEmail = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase))!.Value;
            if (!loggedInEmail.Equals(email, StringComparison.OrdinalIgnoreCase) 
                || string.IsNullOrEmpty(email) 
                || string.IsNullOrEmpty(loggedInEmail))
            {
                context.Fail();
                return Task.CompletedTask;
            }
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
