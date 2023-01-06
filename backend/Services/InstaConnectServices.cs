using InstaConnect.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services.InstaConnectServices
{
    public class InstaConnectServices : IInstaConnectServices
    {
        private IMongoDBService _mongoDBService;
        public InstaConnectServices(IMongoDBService mongoDBService) 
        {
            _mongoDBService = mongoDBService;
        }

        public string? GetConnectionMessage()
        {
            var collection = _mongoDBService.GetCollection();
            TestModel doc = collection.Find(new BsonDocument()).FirstOrDefault();

            return doc.Test;
        }
    }
}
