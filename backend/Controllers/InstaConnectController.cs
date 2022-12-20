using InstaConnect.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using InstaConnect.Models;
using MongoDB.Driver;
using Backend.Services;

namespace InstaConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InstaConnectController : ControllerBase
    {

        private IMongoDBService _mongoDBService;

        public InstaConnectController(IMongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        [HttpGet(Name = "GetConnection")]
        public TestModel Get()
        {
            var collection = _mongoDBService.GetCollection();
            TestModel doc = collection.Find(new BsonDocument()).FirstOrDefault();
            return doc;
        }
    }
}