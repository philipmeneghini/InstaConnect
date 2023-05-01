using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Util.Constants;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class UserModel : IInstaModel
    {
        public static string GetCollectionName()
        {
            return ApplicationConstants.UserCollectionName;
        }

        public object GetIndex()
        {
            return Email;
        }

        public Type GetType()
        {
            return typeof(UserModel);
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("Password")]
        public string? Password { get; set; }

        [BsonElement("firstName")]
        public string? FirstName { get; set; }

        [BsonElement("lastName")]
        public string? LastName { get; set; }

        [BsonElement("birthday")]
        public string? BirthDate { get; set; }

        [Required, EmailAddress]
        [BsonElement("email")]
        public string Email { get; set; }

        [NotMapped]
        public string? ProfilePictureUrl { get; set; }

        [NotMapped]
        public string? PhotosUrl { get; set; }

        [NotMapped]
        public string? ReelsUrl { get; set; }
    }
}