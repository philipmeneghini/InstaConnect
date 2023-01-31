using InstaConnect.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services.InstaConnectServices
{
    public class InstaConnectServices : IInstaConnectServices
    {
        private IMongoDbService _mongoDbService;

        public InstaConnectServices(IMongoDbService mongoDbService) 
        {
            _mongoDbService = mongoDbService;
        }

        public string? GetConnectionMessage()
        {
            TestModel doc = _mongoDbService.GetTestCollectionDoc();

            return doc.Test;
        }
    }
}
