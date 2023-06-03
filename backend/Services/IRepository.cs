using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IRepository<T> where T : IInstaModel
    {
    }
}