using MongoDB.Driver;
using InstaConnect.Models;
using Backend.Services;
using Util.Constants;
using Microsoft.Extensions.Options;
using Backend.Models;

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
        public IMongoCollection<TestModel> GetCollection()
        {
            return _database.GetCollection<TestModel>(ApplicationConstants.TestCollectionName);
        }
    }
}