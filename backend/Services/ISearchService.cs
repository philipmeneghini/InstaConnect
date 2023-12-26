using Backend.Models;

namespace Backend.Services
{
    public interface ISearchService<T> where T : IInstaModel
    {
        public List<T> GetSearch(string? searchParam);

        public Task<List<T>> GetSearchAsync(string? searchParam);
    }
}
