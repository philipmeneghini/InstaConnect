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

        public async Task<List<T>> TryGetBodyAsync<T>() where T : IInstaModel
        {
            var body = new List<T>();
            HttpRequest httpRequest = _httpContextAccessor.HttpContext!.Request;
            httpRequest.EnableBuffering();
            try
            {
                var inputs = await httpRequest.ReadFromJsonAsync<List<T>>();
                if (inputs != null)
                    body.AddRange(inputs);
            }
            catch { }

            httpRequest.Body.Position = 0;

            try
            {
                var input = await httpRequest.ReadFromJsonAsync<T>();
                if (input != null)
                    body.Add(input);
            }
            catch { }

            httpRequest.Body.Position = 0;
            return body;
        }
    }
}
