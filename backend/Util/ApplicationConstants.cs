﻿using Backend.Models;

namespace Util.Constants
{
    class ApplicationConstants
    {
        #region Configuration
        static public readonly string DatabaseName = "InstaConnect";
        static public readonly string TestCollectionName = "Test";
        static public readonly string UserCollectionName = "users";
        static public readonly string ConnectionStrings = "ConnectionString";
        static public readonly string S3BucketName = "instaconnect";
        static public readonly string AmazonS3Credentials = nameof(AmazonS3Credentials);
        static public readonly string UserModel = nameof(UserModel);
        static public readonly string ContentModel = nameof(ContentModel);
        static public readonly string EmailConfig = "AmazonSES";
        static public readonly string Hash = nameof(Hash);
        static public readonly string Jwt = nameof(Jwt);
        static public readonly string CorsPolicy = "corspolicy";
        static public readonly string Star = "*";
        static public readonly string JwtKey = "Jwt:Key";
        static public readonly string Email = nameof(Email);
        static public readonly string Id = nameof(Id);
        #endregion

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
        static public readonly string ContentEmpty = "no content passed in";
        static public readonly string IdsEmpty = "no ids passed in";
        static public readonly string EmailEmpty = "no email passed in";
        static public readonly string MediaTypeEmpty = "cannot leave mediaType empty";
        static public readonly string MediaTypeNotValid = "media type is not valid";
        static public readonly string ContentIdEmpty = "no content id passed in";
        static public readonly string ContentIdNotHexadecimal = "content id is not a hexadecimal";
        static public readonly string NoUsersFound = "no users found";
        static public readonly string NoContentFound = "no content found";
        static public readonly Dictionary<Type, string> ModelNames = new Dictionary<Type, string>()
        {
            { typeof(UserModel), "User" }
        };
        static public readonly string NotFoundMongoErrorMessage = "No models found";
        static public readonly string BadRequestBulkWriteMongoErrorMessage = "{0}s not properly updated";
        static public readonly string FailedToDeleteMongo = "Failed to delete {0} models";
        static public readonly string InsertModelExistsException = "model with the same id already exists";
        static public readonly List<string> UserBadRequestErrorMessages = new List<string>() { EmailValid, EmailEmpty, FirstNameEmpty, FirstNameValid, LastNameEmpty, LastNameValid, BirthdateEmpty, BirthdateValid };
        static public readonly List<string> ContentBadRequestErrorMessages = new List<string>() { EmailValid, EmailEmpty, ContentIdEmpty, ContentIdNotHexadecimal, MediaTypeEmpty, MediaTypeNotValid };
        static public readonly string AwsDestinationNotFound = "no AWS Destination for file upload found";
        static public readonly string InternalServerError = "Internal Server Error: ";
        #endregion

        #region CRUD Operations
        static public readonly string Get = nameof(Get);
        static public readonly string Update = nameof(Update);
        static public readonly string Create = nameof(Create);
        static public readonly string Delete = nameof(Delete);
        #endregion

        #region AwsDestinations
        static public readonly string ProfilePictureDestination = "users/{0}/profilePictures";
        static public readonly string PhotosDestination = "users/{0}/photos";
        static public readonly string ReelsDestination = "users/{0}/reels";
        static public readonly string PhotosContentDestination = "users/{0}/photos/{1}";
        static public readonly string ReelsContentDestination = "users/{0}/reels/{1}";

        static public readonly string ProfilePicture = "Profile Picture";
        static public readonly string Photos = "Photos";
        static public readonly string Reels = "Reels";
        #endregion
    }
}