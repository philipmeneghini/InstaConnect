using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Util.Constants;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class CommentModel : IInstaModel
    {
        public static string GetCollectionName()
        {
            return ApplicationConstants.CommentCollectionName;
        }

        public object GetIndex()
        {
            return Id;
        }

        public Type GetType()
        {
            return typeof(CommentModel);
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("dateCreated")]
        public DateTime? DateCreated { get; set; }

        [BsonElement("dateUpdated")]
        public DateTime? DateUpdated { get; set; }

        [BsonElement("contentId")]
        public string? ContentId { get; set; }

        [BsonElement("body")]
        public string? Body { get; set; }

        [BsonElement("likes")]
        public HashSet<string> Likes { get; set; }

        [Required, EmailAddress]
        [BsonElement("email")]
        public string Email { get; set; }
    }
}