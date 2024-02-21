using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Util.Constants;

namespace Backend.Authorization
{

    public class UserUpdateCreateHandler : AuthorizationHandler<UserUpdateCreateRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserUpdateCreateHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync
            (AuthorizationHandlerContext context, UserUpdateCreateRequirement requirement)
        {
            HttpRequest httpRequest = _httpContextAccessor.HttpContext!.Request;
            httpRequest.EnableBuffering();
            var input = httpRequest.ReadFromJsonAsync<UserModel>().Result;
            var email = input?.Email;
            string loggedInEmail = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase))!.Value;
            if (!loggedInEmail.Equals(email, StringComparison.OrdinalIgnoreCase) 
                && !string.IsNullOrEmpty(email) 
                && !string.IsNullOrEmpty(loggedInEmail))
            {
                context.Fail();
                return Task.CompletedTask;
            }
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
