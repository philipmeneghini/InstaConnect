using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Backend.Models;
using Util.Constants;

namespace InstaConnect.Models
{
    public class TestModel : IInstaModel
    {
        public string GetCollectionName()
        {
            return ApplicationConstants.TestCollectionName;
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("test")]
        public string? Test { get; set; }
    }
}
