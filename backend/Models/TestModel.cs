using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InstaConnect.Models
{
    public class TestModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        [BsonElement("_id")]
        public string? Id { get; set; }
        [BsonElement("test")]
        public string? Test { get; set; }
    }
}
