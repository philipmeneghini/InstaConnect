using InstaConnect.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using InstaConnect.Models;
using MongoDB.Driver;
using Backend.Services.InstaConnectServices;
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
            this._mongoDBService = mongoDBService;
        }

        [HttpGet(Name = "GetConnection")]
        public string? Get()
        {
            InstaConnectServices connection = new(_mongoDBService);
            return connection.GetConnectionMessage();
        }
    }
}