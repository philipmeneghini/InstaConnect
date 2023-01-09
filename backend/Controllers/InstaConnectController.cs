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

        private IMongoDbService _mongoDBService;
        private IInstaConnectServices _instaConnectServices;

        public InstaConnectController(IInstaConnectServices InstaConnectServices)
        {
            _instaConnectServices = InstaConnectServices;
        }

        [HttpGet(Name = "GetConnection")]
        public string? Get()
        {
            return _instaConnectServices.GetConnectionMessage();
        }
    }
}