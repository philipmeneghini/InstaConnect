using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Util.Constants;
using System.ComponentModel.DataAnnotations;
using Backend.Util;

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

        [BsonElement("followers")]
        public HashSet<string>? Followers { get; set; }

        [BsonElement("following")]
        public HashSet<string>? Following { get; set; }

        [Required, EmailAddress]
        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("role")]
        public Role Role { get; set; }

        [BsonIgnore]
        public string? ProfilePictureUrl { get; set; }

        [BsonIgnore]
        public string? PhotosUrl { get; set; }

        [BsonIgnore]
        public string? ReelsUrl { get; set; }

        [BsonIgnore]
        public string? UploadProfilePictureUrl { get; set; }

        [BsonIgnore]
        public string? UploadPhotosUrl { get; set; }

        [BsonIgnore]
        public string? UploadReelsUrl { get; set; }
    }
}