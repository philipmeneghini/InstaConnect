using Backend.Models;
using System.Security.Claims;

namespace Backend.Authorization.Helpers
{
    public interface IAuthorizationHelper<T> where T : IInstaModel
    {
        public Claim? RetrieveRole();

        public string? RetrieveLoggedInEmail();

        public bool TryGetBody(out List<T> body);

        public bool TryGetQueries(string queryName, out List<string> query);
    }
}
