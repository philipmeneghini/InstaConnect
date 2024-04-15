using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;
using Util.Constants;

namespace Backend.Models
{
    public class NotificationModel : IInstaModel
    {
        public static string GetCollectionName()
        {
            return ApplicationConstants.NotificationCollectionName;
        }

        public object GetIndex()
        {
            return Id;
        }

        public Type GetType()
        {
            return typeof(NotificationModel);
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("dateCreated")]
        public DateTime? DateCreated { get; set; } = DateTime.UtcNow;

        [Required]
        [BsonElement("reciever")]
        public string Reciever { get; set; }

        [BsonElement("read")]
        public bool Read { get; set; } = false;

        [BsonElement("sender")]
        public string? Sender { get; set; }

        [BsonElement("body")]
        public string? Body { get; set; }
    }
}
