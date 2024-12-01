using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Backend.Models
{
    public interface IInstaModel 
    {
        public object GetIndex();

        public Type GetType();

        public IInstaModel Clone();

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        [BsonElement("_id")]
        public string? Id { get; set; }
    }
}
