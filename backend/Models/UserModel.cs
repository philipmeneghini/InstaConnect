using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Backend.Models;
using System.Transactions;
using Util.Constants;
using System.Runtime.CompilerServices;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.ComponentModel.DataAnnotations.Schema;

namespace InstaConnect.Models
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

        [NotMapped]
        public string? ProfilePictureUrl { get; set; }

        [BsonElement("Password")]
        public string? Password { get; set; }

        [BsonElement("firstName")]
        public string? FirstName { get; set; }

        [BsonElement("lastName")]
        public string? LastName { get; set; }

        [BsonElement("birthday")]
        public string? BirthDate { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }
    }
}