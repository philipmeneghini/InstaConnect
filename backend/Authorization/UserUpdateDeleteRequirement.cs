using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization
{
    public class UserUpdateCreateRequirement : IAuthorizationRequirement
    {
        public UserUpdateCreateRequirement() { }
    }
}
