using MongoDB.Driver;
using MongoDB.Bson;
using InstaConnect.Models;
using Backend.Services;
using Util.AppSettings;
using Util.Constants;

namespace InstaConnect.Services
{
    public class MongoDBService : IMongoDBService
    {
        private MongoClient dbClient;
        private IMongoDatabase database;
        public MongoDBService()
        {
            //string username = Environment.GetEnvironmentVariable("DB_USERNAME");
            //string password = Environment.GetEnvironmentVariable("DB_PASSWORD");

            AppSettingsService appsettingservice = new AppSettingsService();
            this.dbClient = new MongoClient(appsettingservice.GetConnectionString());

            this.database = this.dbClient.GetDatabase(ApplicationConstants.DatabaseName);
        }
        public IMongoCollection<TestModel> GetCollection()
        {
            return this.database.GetCollection<TestModel>(ApplicationConstants.TestCollectionName);
        }
    }
}