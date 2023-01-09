using InstaConnect.Models;
using MongoDB.Driver;

namespace Backend.Services
{
    public interface IMongoDbService
    {
        public IMongoCollection<TestModel> GetCollection();
    }
}
