using Backend.Models;
using System.Security.Claims;

namespace Backend.Authorization.Helpers
{
    public interface IAuthorizationHelper
    {
        public Claim? GetRole();

        public string? GetLoggedInEmail();

        public Task<List<T>> TryGetBodyAsync<T>() where T : IInstaModel;

        public bool TryGetQueries(string queryName, out List<string> query);
    }
}
