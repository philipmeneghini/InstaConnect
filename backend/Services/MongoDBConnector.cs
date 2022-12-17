using MongoDB.Driver;
using MongoDB.Bson;
using InstaConnect.Models;

namespace InstaConnect.Services
{
    public class MongoDBConnector
    {
        private MongoClient dbClient;
        private IMongoDatabase database;
        public MongoDBConnector()
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

        public string GetDatabase()
        {
            var list = this.dbClient.ListDatabases().ToList();
            return list[0].ToString();
        }
    }
}