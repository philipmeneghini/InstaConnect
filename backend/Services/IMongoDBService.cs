using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IMongoDbService<T> where T : IInstaModel
    {
    }
}