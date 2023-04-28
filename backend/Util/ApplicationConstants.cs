using InstaConnect.Models;
using System.Collections.Generic;
using System.ComponentModel;
using System.Net.NetworkInformation;

namespace Util.Constants
{
    class ApplicationConstants
    {
        static public readonly string DatabaseName = "InstaConnect";
        static public readonly string TestCollectionName = "Test";
        static public readonly string UserCollectionName = "users";
        static public readonly string ConnectionStrings = "ConnectionString";
        static public readonly string S3BucketName = "instaconnect";
        static public readonly string AmazonS3Credentials = nameof(AmazonS3Credentials);
        static public readonly string UserModel = nameof(UserModel);
        static public readonly string Hash = nameof(Hash);
        static public readonly string Jwt = nameof(Jwt);

        #region Error Messages
        static public readonly string FirstNameEmpty = "first name cannot be empty";
        static public readonly string FirstNameValid = "first name must only contain letters";
        static public readonly string EmailValid = "email is not valid";
        static public readonly string EmailDoesNotExist = "email doesn't exist in the database";
        static public readonly string LastNameEmpty = "last name cannot be empty";
        static public readonly string LastNameValid = "last name must only contain letters";
        static public readonly string BirthdateEmpty = "birthdate cannot be empty";
        static public readonly string BirthdateValid = "birthdate must be a valid date";
        static public readonly string ErrorDeletingProfilePicture = "Error deleting profile picture with email {0}";
        static public readonly string NoArgumentsPassed = "no valid arguments have been passed into the endpoint";
        static public readonly string UserEmpty = "no user passed in";
        static public readonly string EmailEmpty = "no email passed in";
        static public readonly string NoUsersFound = "no users found";
        static public readonly Dictionary<Type, string> ModelNames = new Dictionary<Type, string>()
        {
            { typeof(UserModel), "User" }
        };
        static public readonly string NotFoundMongoErrorMessage = "No models found";
        static public readonly string BadRequestBulkWriteMongoErrorMessage = "{0}s not properly updated";
        static public readonly string FailedToDeleteMongo = "Failed to delete {0} models";
        static public readonly string InsertModelExistsException = "model with the same id already exists";
        static public readonly List<string> BadRequestErrorMessages = new List<string>() { FirstNameEmpty, FirstNameValid, LastNameEmpty, LastNameValid, BirthdateEmpty, BirthdateValid };
        #endregion

        #region CRUD Operations
        static public readonly string Get = nameof(Get);
        static public readonly string Update = nameof(Update);
        static public readonly string Create = nameof(Create);
        static public readonly string Delete = nameof(Delete);
        #endregion

    }
}