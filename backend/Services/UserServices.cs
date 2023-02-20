using InstaConnect.Models;
using Backend.Interfaces;
using Backend.Services;
using MongoDB.Driver;
using Backend.Util;
using MongoDB.Bson;
using Backend.Util.Exceptions;

namespace Backend.UserServices
{
    public class UserServices : IUserServices
    {
        private IMongoDbService _mongoDbService;
        private IMongoCollection<UserModel> _mongoCollection;
        private IS3BucketService _s3BucketService;

        public UserServices(IMongoDbService mongoDbService, IS3BucketService s3BucketService)
        {
            _mongoDbService = mongoDbService;
            _mongoCollection = _mongoDbService.GetUserCollection();
            _s3BucketService = s3BucketService;
            
        }
        public List<UserModel> GetUsers(string? firstName, string? lastName)
        {
            List<UserModel> users;

            if (firstName != null && lastName != null)
            {
                users = _mongoCollection.Find(user => user.FirstName == firstName && user.LastName == lastName).ToList();
            }

            else if (firstName == null && lastName != null)
            {
                users = _mongoCollection.Find(user => user.LastName == lastName).ToList();
            }

            else if (firstName != null && lastName == null)
            {
                users = _mongoCollection.Find(user => user.FirstName == firstName).ToList();
            }

            else
            {
                throw new InstaBadRequestException("Missing both first and last name as parameters");
            }

            if (users.Count == 0 )
            {
                throw new InstaNotFoundException("No users with that name are found");
            }

            return users;
        }

        public UserModel GetUser(string? email)
        {
            if (email == null)
            {
                throw new InstaBadRequestException("No email passed in as a parameter");
            }

            UserModel user = _mongoCollection.Find(user => user.Email == email).FirstOrDefault();

            if (user == null)
            {
                throw new InstaNotFoundException("No user with that email found");
            }

            return user;
        }

        public UserModel CreateUser(UserModel newUser)
        {
  
            string? email = newUser.Email;
            if (!ContactValidator.isEmailValid(email))
            {
                throw new InstaBadRequestException($"Email address {email} is not valid or missing");
            }

            UserModel user = _mongoCollection.Find(user => user.Email == email).FirstOrDefault();
            if (user != null)
            {
                throw new InstaBadRequestException($"User with email address {email} already exists");
            }

            if (newUser.FirstName == null || newUser.LastName == null || newUser.BirthDate == null)
            {
                throw new InstaBadRequestException($"user entry with email address {email} needs a first name, last name and birthdate field");
            }
            string url = _s3BucketService.GeneratePresignedUrl(newUser.Email);
            newUser.ProfilePicture = url;
            _mongoCollection.InsertOne(newUser);
            return newUser;      
        }

        public UserModel UpdateUser(UserModel newUser)
        {

            string? email = newUser.Email;
            if (!ContactValidator.isEmailValid(email))
            {
                throw new InstaBadRequestException($"Email address {email} is not valid or missing");
            }

            if (newUser.FirstName == null || newUser.LastName == null || newUser.BirthDate == null)
            {
                throw new InstaBadRequestException($"user entry needs a first name, last name and birthdate field");
            }

            UserModel user;
            if (newUser.Id != null)
            {
                var arrayFilter = Builders<UserModel>.Filter.Eq("Id", newUser.Id);
                user = _mongoCollection.FindOneAndReplace<UserModel>(arrayFilter, newUser);
                if (user == null)
                {
                    throw new InstaNotFoundException($"No user with email address {newUser.Id} exists");
                }
            }

            else
            {
                var arrayFilter = Builders<UserModel>.Filter.Eq("Email", newUser.Email);
                user = _mongoCollection.FindOneAndReplace<UserModel>(arrayFilter, newUser);

                if (user == null)
                {
                    throw new InstaBadRequestException($"No user with email address {email} exists");
                }
            }
            return user;
        }

        public UserModel DeleteUser(string email)
        {
            if (email == null)
            {
                throw new InstaBadRequestException("No email passed in as a parameter");
            }

            UserModel user = _mongoCollection.Find(user => user.Email == email).FirstOrDefault();

            if (user == null)
            {
                throw new InstaNotFoundException("No user with that email found");
            }
            FilterDefinition<UserModel>? deleteFilter = Builders<UserModel>.Filter.Eq("Email", email);
            DeleteResult deletedUser = _mongoCollection.DeleteOne(deleteFilter);
            if (deletedUser.IsAcknowledged == false)
            {
                throw new Exception();
            }

            return user;
        }
    }
}