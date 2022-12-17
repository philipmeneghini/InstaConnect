using InstaConnect.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using InstaConnect.Models;
using MongoDB.Driver;

namespace InstaConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InstaConnectController : ControllerBase
    {
        [HttpGet(Name = "GetConnection")]
        public TestModel Get()
        {
            MongoDBConnector db = new MongoDBConnector();
            var collection = db.GetCollection();
            TestModel doc = collection.Find(new BsonDocument()).FirstOrDefault();
            return doc;
        }
    }
}