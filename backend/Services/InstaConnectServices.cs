﻿using InstaConnect.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services.InstaConnectServices
{
    public class InstaConnectServices
    {
        private IMongoDBService _mongoDBService;
        public InstaConnectServices(IMongoDBService mongoDBService) 
        {
            this._mongoDBService = mongoDBService;
        }

        public string? GetConnectionMessage()
        {
            var collection = _mongoDBService.GetCollection();
            TestModel doc = collection.Find(new BsonDocument()).FirstOrDefault();

            return doc.Test;
        }
    }
}
