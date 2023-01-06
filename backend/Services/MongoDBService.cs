using MongoDB.Driver;
using MongoDB.Bson;
using InstaConnect.Models;
using Backend.Services;
using Util.Constants;
using Backend.Models;
using Microsoft.Extensions.Options;

namespace InstaConnect.Services
{
    public class MongoDBService : IMongoDBService
    {
        private MongoClient dbClient;
        private IMongoDatabase database;
        private readonly ConnectionStrings _connectionStrings;
        public MongoDBService(IOptions<ConnectionStrings> connectionstrings)
        {
            _connectionStrings = connectionstrings.Value;
            dbClient = new MongoClient(_connectionStrings.Local);

            database = dbClient.GetDatabase(ApplicationConstants.DatabaseName);
        }
        public IMongoCollection<TestModel> GetCollection()
        {
            return database.GetCollection<TestModel>(ApplicationConstants.TestCollectionName);
        }
    }
}