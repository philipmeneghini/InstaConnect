using Backend.Models;
using System.Security.Claims;
using Util.Constants;

namespace Backend.Authorization.Helpers
{
    public class AuthorizationHelper : IAuthorizationHelper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthorizationHelper(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Claim? GetRole()
        {
            return _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Role, StringComparison.OrdinalIgnoreCase));
        }

        public string? GetLoggedInEmail()
        {
            return _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(c => c.Type.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase))!.Value;
        }

        public bool TryGetQueries(string queryName, out List<string> query)
        {
            query = new List<string>();
            HttpRequest httpRequest = _httpContextAccessor.HttpContext!.Request;
            httpRequest.EnableBuffering();
            var list = httpRequest.Query.FirstOrDefault(q => q.Key.Equals(queryName, StringComparison.OrdinalIgnoreCase)).Value;

            foreach (var val in list)
            {
                if (!string.IsNullOrWhiteSpace(val))
                    query.Add(val);
            }

            return query.Count > 0;
        }

        public bool TryGetBody<T>(out List<T> body) where T : IInstaModel
        {
            body = new List<T>();
            HttpRequest httpRequest = _httpContextAccessor.HttpContext!.Request;
            httpRequest.EnableBuffering();
            var inputs = httpRequest.ReadFromJsonAsync<List<T>>();
            if (inputs.IsCompletedSuccessfully && inputs.Result != null)
                body.AddRange(inputs.Result);

            var input = httpRequest.ReadFromJsonAsync<T>();
            if (input.IsCompletedSuccessfully && input.Result != null)
                body.Add(input.Result);

            httpRequest.Body.Position = 0;
            return body.Count > 0;
        }
    }
}
