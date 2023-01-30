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

        private IInstaConnectServices _instaConnectServices;

        public InstaConnectController(IInstaConnectServices InstaConnectServices)
        {
            _instaConnectServices = InstaConnectServices;
        }

        [HttpGet("GetConnection")]
        public string? GetConnection()
        {
            return _instaConnectServices.GetConnectionMessage();
        }

        [HttpGet("GetUser")]
        public string? GetUser()
        {
            string firstName = Request.Query["FirstName"];
            string lastName = Request.Query["LastName"];
            return firstName + " " + lastName;
        }
    }
}