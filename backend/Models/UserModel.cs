using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InstaConnect.Models
{
    public class UserModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("first name")]
        public string? FirstName { get; set; }

        [BsonElement("last name")]
        public string? LastName { get; set; }

        [BsonElement("birthday")]
        public string? BirthDate { get; set; }

        [BsonElement("email")]
        public string? Email { get; set; }

        [BsonElement("profile picture")]
        public string? ProfilePicture { get; set; }
    }
}