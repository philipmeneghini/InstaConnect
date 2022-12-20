using MongoDB.Driver;
using MongoDB.Bson;
using InstaConnect.Models;
using Backend.Services;

namespace InstaConnect.Services
{
    public class MongoDBService : IMongoDBService
    {
        private MongoClient dbClient;
        private IMongoDatabase database;
        public MongoDBService()
        {
            string username = Environment.GetEnvironmentVariable("DB_USERNAME");
            string password = Environment.GetEnvironmentVariable("DB_PASSWORD");
            this.dbClient = new MongoClient("mongodb+srv://" + username + ":" + password + "@cluster0.zzrlv29.mongodb.net/test");

            this.database = this.dbClient.GetDatabase ("InstaConnect");
        }
        public IMongoCollection<TestModel> GetCollection()
        {
            return this.database.GetCollection<TestModel>("InstaConnectCollection");
        }
    }
}