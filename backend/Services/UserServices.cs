using InstaConnect.Models;
using Backend.Interfaces;
using Backend.Services;
using MongoDB.Driver;
using Backend.Util;
using MongoDB.Bson;

namespace Backend.UserServices
{
    public class UserServices : IUserServices
    {
        private IMongoDbService _mongoDbService;
        private IMongoCollection<UserModel> _mongoCollection;

        public UserServices(IMongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
            _mongoCollection = _mongoDbService.GetUserCollection();
            
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
                throw new Exception("Missing both first and last name as parameters");
            }

            if (users.Count == 0 )
            {
                throw new Exception("No users with that name are found");
            }

            return users;
        }

        public UserModel GetUser(string? email)
        {
            if (email == null)
            {
                throw new Exception("No email passed in as a parameter");
            }

            UserModel user = _mongoCollection.Find(user => user.Email == email).FirstOrDefault();

            if (user == null)
            {
                throw new Exception("No user with that email found");
            }

            return user;
        }

        public UserModel CreateUser(UserModel newUser)
        {
            try
            {
                string? email = newUser.Email;
                if (!ContactValidator.isEmailValid(email))
                {
                    throw new Exception($"Email address {email} is not valid or missing");
                }

                UserModel user = _mongoCollection.Find(user => user.Email == email).FirstOrDefault();
                if (user != null)
                {
                    throw new Exception($"User with email address {email} already exists");
                }

                if (newUser.FirstName == null || newUser.LastName == null || newUser.BirthDate == null)
                {
                    throw new Exception($"user entry with email address {email} needs a first name, last name and birthdate field");
                }
                _mongoCollection.InsertOne(newUser);
                return newUser;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public UserModel UpdateUser(UserModel newUser)
        {
            try
            {
                string? email = newUser.Email;
                if (!ContactValidator.isEmailValid(email))
                {
                    throw new Exception($"Email address {email} is not valid or missing");
                }

                if (newUser.FirstName == null || newUser.LastName == null || newUser.BirthDate == null)
                {
                    throw new Exception($"user entry needs a first name, last name and birthdate field");
                }

                UserModel user;
                if (newUser.Id != null)
                {
                    var arrayFilter = Builders<UserModel>.Filter.Eq("Id", newUser.Id);
                    user = _mongoCollection.FindOneAndReplace<UserModel>(arrayFilter, newUser);
                    if (user == null)
                    {
                        throw new Exception($"No user with email address {newUser.Id} exists");
                    }
                }

                else
                {
                    var arrayFilter = Builders<UserModel>.Filter.Eq("Email", newUser.Email);
                    user = _mongoCollection.FindOneAndReplace<UserModel>(arrayFilter, newUser);

                    if (user == null)
                    {
                        throw new Exception($"No user with email address {email} exists");
                    }
                }

                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public UserModel DeleteUser(string email)
        {
            try
            {
                FilterDefinition<UserModel>? deleteFilter = Builders<UserModel>.Filter.Eq("Email", email);
                UserModel deletedUser = _mongoCollection.DeleteOne<UserModel>(deleteFilter);
                if (deletedUser == null)
                {
                    throw new Exception("No user deleted");
                }
                return deletedUser;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }
    }
}