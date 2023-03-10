using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Backend.Models;

namespace InstaConnect.Models
{
    public class UserModel : IInstaModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("firstName")]
        public string? FirstName { get; set; }

        [BsonElement("lastName")]
        public string? LastName { get; set; }

        [BsonElement("birthday")]
        public string? BirthDate { get; set; }

        [BsonElement("email")]
        public string? Email { get; set; }

        [BsonElement("profilePicture")]
        public string? ProfilePicture { get; set; }
    }
}