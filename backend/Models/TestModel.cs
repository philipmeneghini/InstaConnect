using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InstaConnect.Models
{
    public class TestModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? _id { get; set; }
        public string? test { get; set; }
    }
}
