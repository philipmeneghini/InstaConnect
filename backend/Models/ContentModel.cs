using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Util.Constants;
using System.ComponentModel.DataAnnotations;
using Util.MediaType;
using System.ComponentModel;

namespace Backend.Models
{
    public class ContentModel : IInstaModel
    {
        public static string GetCollectionName()
        {
            return ApplicationConstants.UserCollectionName;
        }

        public object GetIndex()
        {
            return Id;
        }

        public Type GetType()
        {
            return typeof(ContentModel);
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("dateCreated")]
        public DateTime? DateCreated { get; set; }

        [BsonElement("dateUpdated")]
        public DateTime? DateUpdated { get; set; }

        [BsonElement("caption")]
        public string? Caption { get; set; }

        [BsonElement("likes")]
        public int Likes { get; set; }

        [DefaultValue(typeof(MediaType), "Unknown")]
        [BsonElement("mediaType")]
        public MediaType MediaType { get; set; }

        [Required, EmailAddress]
        [BsonElement("email")]
        public string Email { get; set; }

        [BsonIgnore]
        public string? MediaUrl { get; set; }
    }
}