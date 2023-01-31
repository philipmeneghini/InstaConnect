using MongoDB.Driver;
using InstaConnect.Models;
using Backend.Services;
using Util.Constants;
using Microsoft.Extensions.Options;
using Backend.Models;
using MongoDB.Bson;

namespace InstaConnect.Services
{
    public class MongoDbService : IMongoDbService
    {
        private MongoClient _dbClient;
        private IMongoDatabase _database;
        private readonly ConnectionStringModel _connectionStrings;

        public MongoDbService(IOptions<ConnectionStringModel> ConnectionStrings)
        {
            _connectionStrings = ConnectionStrings.Value;
            _dbClient = new MongoClient(_connectionStrings.MongoDb);

            _database = _dbClient.GetDatabase(ApplicationConstants.DatabaseName);
        }
        public TestModel GetTestCollectionDoc()
        {
            IMongoCollection <TestModel> collection = _database.GetCollection<TestModel>(ApplicationConstants.TestCollectionName);
            return collection.Find(new BsonDocument()).FirstOrDefault();
        }

        public IMongoCollection<UserModel> GetUserCollection()
        {
            return _database.GetCollection<UserModel>(ApplicationConstants.UserCollectionName);
        }
    }
}