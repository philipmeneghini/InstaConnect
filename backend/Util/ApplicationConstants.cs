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

        #region Error Messages
        static public readonly string FirstNameEmpty = "first name cannot be empty";
        static public readonly string FirstNameValid = "first name must only contain letters";
        static public readonly string EmailEmpty = "email cannot be empty";
        static public readonly string EmailValid = "email is not valid";
        static public readonly string EmailExists = "email doesn't exist in the database";
        static public readonly string LastNameEmpty = "last name cannot be empty";
        static public readonly string LastNameValid = "last name must only contain letters";
        static public readonly string BirthdateEmpty = "birthdate cannot be empty";
        static public readonly string BirthdateValid = "birthdate must be a valid date";
        static public readonly string ErrorDeletingProfilePicture = "Error deleting profile picture with email {0}";
        static public readonly string NoArgumentsPassed = "no valid arguments have been passed into the endpoint";
        static public readonly string NoUsersFound = "no users found";
        static public readonly string UserEmpty = "no user passed in";
        #endregion

        #region FluentValidatorErrorLists
        static public readonly List<string> NotFoundErrorCodes = new List<string>() { "PredicateValidator" };
        static public readonly List<string> BadRequestErrorCodes = new List<string>() { "EmailValidator" };
        #endregion
    }
}