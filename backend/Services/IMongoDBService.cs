using InstaConnect.Models;
using MongoDB.Driver;

namespace Backend.Services
{
    public interface IMongoDBService
    {
        public IMongoCollection<TestModel> GetCollection();
    }
}
