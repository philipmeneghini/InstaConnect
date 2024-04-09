using Backend.Models;

namespace Util.Constants
{
    class ApplicationConstants
    {
        #region Configuration
        static public readonly string DatabaseName = "InstaConnect";
        static public readonly string TestCollectionName = "Test";
        static public readonly string UserCollectionName = "users";
        static public readonly string ContentCollectionName = "contents";
        static public readonly string CommentCollectionName = "comments";
        static public readonly string ConnectionStrings = "ConnectionString";
        static public readonly string S3BucketName = "instaconnect";
        static public readonly string AmazonS3Credentials = "AmazonCredentials:S3";
        static public readonly string UserModel = nameof(UserModel);
        static public readonly string ContentModel = nameof(ContentModel);
        static public readonly string CommentModel = nameof(CommentModel);
        static public readonly string EmailConfig = "AmazonSES";
        static public readonly string Hash = nameof(Hash);
        static public readonly string Jwt = nameof(Jwt);
        static public readonly string CorsPolicy = "corspolicy";
        static public readonly string Star = "*";
        static public readonly string JwtKey = "Jwt:Key";
        static public readonly string Email = nameof(Email);
        static public readonly string ContentId = nameof(ContentId);
        static public readonly string Id = nameof(Id);
        static public readonly string AmazonSESCredentials = "AmazonCredentials:SES";
        static public readonly string S3 = nameof(S3);
        static public readonly string SES = nameof(SES);
        static public readonly string EmailService = "Email Service";
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
        static public readonly string CommentEmpty = "no comment passed in";
        static public readonly string IdsEmpty = "no ids passed in";
        static public readonly string EmailEmpty = "no email passed in";
        static public readonly string EmailIdEmpty = "no email or id passed in";
        static public readonly string MediaTypeEmpty = "cannot leave mediaType empty";
        static public readonly string MediaTypeNotValid = "media type is not valid";
        static public readonly string ContentIdEmpty = "no content id passed in";
        static public readonly string ContentIdNotHexadecimal = "content id is not a hexadecimal";
        static public readonly string NoUsersFound = "no users found";
        static public readonly string NoContentFound = "no content found";
        static public readonly string BodyEmpty = "comment must have a body";
        static public readonly string DateUpdatedFilled = "date updated field must be left empty";
        static public readonly string DateCreatedFilled = "date created field must be left empty";
        static public readonly string CommentIdEmpty = "no comment id passed in";
        static public readonly string NoCommentsFound = "no comments found";
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
        static public readonly List<string> CommentBadRequestErrorMessages = new List<string>() { EmailValid, EmailEmpty, ContentIdEmpty, ContentIdNotHexadecimal, CommentIdEmpty, DateUpdatedFilled, DateCreatedFilled };
        static public readonly List<string> EmailServicerBadRequestErrorMessages = new List<string>() { EmailValid, EmailEmpty, FirstNameEmpty, FirstNameValid, LastNameEmpty, LastNameValid, BirthdateEmpty, BirthdateValid };
        static public readonly string AwsDestinationNotFound = "no AWS Destination for file upload found";
        static public readonly string InternalServerError = "Internal Server Error: ";
        static public readonly string NoSearchParam = "No search parameters passed in!";
        static public readonly string NoRolesPassedIn = "No role or user has been passed in!";
        #endregion

        #region CRUD Operations
        static public readonly string Get = nameof(Get);
        static public readonly string Update = nameof(Update);
        static public readonly string Create = nameof(Create);
        static public readonly string Delete = nameof(Delete);
        #endregion

        #region AwsDestinations
        static public readonly string ProfilePictureDestination = "profilePicture/{0}/profilePicture.png";
        static public readonly string PhotosDestination = "users/{0}/photos";
        static public readonly string ReelsDestination = "users/{0}/reels";
        static public readonly string PhotosContentDestination = "photos/{0}/{1}.png";
        static public readonly string ReelsContentDestination = "reels/{0}/{1}";

        static public readonly string ProfilePicture = "Profile Picture";
        static public readonly string Photos = nameof(Photos);
        static public readonly string Reels = nameof(Reels);
        static public readonly string Unknown = nameof(Unknown);
        #endregion

        #region Registration Email
        static public readonly string InstaConnectEmail = "instaconnect22@gmail.com";
        static public readonly string UTF8 = "UTF-8";
        static public readonly string RegistrationSubject = "Welcome to InstaConnect!";
        static public readonly string RegistrationBody = "Dear {0}, \n\n " +
            "Thank you for signing up to join InstaConnect! You are almost finished registering and just need to verify this email is yours by clicking {1}. \n" +
            "We look forward to your use and support of InstaConnect! \n\n" +
            "Kind Regards, \n" +
            "InstaConnect Team";
        static public readonly string RegistrationURL = "http://localhost:3000/setPassword?token={0}";
        #endregion

        #region Reset Password Email
        static public readonly string ResetPasswordSubject = "Reset your InstaConnect Password";
        static public readonly string ResetPasswordBody = "Dear {0}, \n\n" +
            "We've receved a request to reset the password for your InstaConnect account. If you did not make this request please ignore this email. \n\n" +
            "In order to finish resetting your password please click the following link {1}. \n\n" +
            "Kind regards, \n" +
            "InstaConnect Team";
        #endregion

        #region Authentication
        static public readonly string DateOfBirth = nameof(DateOfBirth);
        static public readonly string Exp = "exp";
        static public readonly string Name = nameof(Name);
        static public readonly string MisingEmailOrPassword = "missing email or password";
        static public readonly string InvalidPassword = "invalid password";
        static public readonly string NoToken = "no token passed in";
        #endregion

        #region Media AWS Dictionaries
        static public readonly string ImageJpeg = "image/jpeg";
        static public readonly string VideoGif = "video/gif";
        static public readonly Dictionary<string, string> MediaContentType = new Dictionary<string, string>() {
            { ProfilePicture, ImageJpeg },
            { Photos, ImageJpeg },
            { Reels,  VideoGif },
            { Unknown, string.Empty }
        };
        #endregion

        #region RegEx
        static public readonly string I = "i";
        static public readonly string BlankString = " ";
        #endregion

        #region Roles
        static public readonly string Role = nameof(Role);
        static public readonly string[] AdminRoleList = new string[] 
        { 
            Backend.Util.Role.Administrator.ToString() 
        };
        static public readonly string[] AdminUserRoleList = new string[] 
        { 
            Backend.Util.Role.Administrator.ToString(), 
            Backend.Util.Role.RegularUser.ToString() 
        };
        static public readonly string[] AdminGuestRoleList = new string[]
        {
            Backend.Util.Role.Administrator.ToString(),
            Backend.Util.Role.Guest.ToString()
        };
        #endregion
    }
}