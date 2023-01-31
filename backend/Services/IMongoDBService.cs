using InstaConnect.Models;
using MongoDB.Driver;

namespace Backend.Services
{
    public interface IMongoDbService
    {
        public TestModel GetTestCollectionDoc();

        public IMongoCollection<UserModel> GetUserCollection();
    }
}
