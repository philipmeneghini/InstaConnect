using MongoDB.Driver;
using Backend.Services.Interfaces;
using Util.Constants;
using Microsoft.Extensions.Options;
using Backend.Models;
using Util.Exceptions;
using Backend.Models.Config;

namespace InstaConnect.Services
{
    public abstract class Repository<T> : IRepository<T> where T:IInstaModel
    {
        private MongoClient _dbClient;
        private IMongoDatabase _database;
        private IMongoCollection<T> _collection;
        private string _index;

        protected Repository(IOptions<MongoSettings<T>> settings)
        {
            _dbClient = new MongoClient(settings.Value.ConnectionString);
            _database = _dbClient.GetDatabase(ApplicationConstants.DatabaseName);
            _collection = _database.GetCollection<T>(settings.Value.Collection);
            _index = settings.Value.Index;
        }

        protected T GetModel(FilterDefinition<T> filter)
        {
            var result= _collection.Find(filter);
            var model = result.FirstOrDefault();
            if (model == null)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            return model;
        }

        protected async Task<T> GetModelAsync(FilterDefinition<T> filter)
        {
            var result = await _collection.FindAsync(filter);
            var model = result.FirstOrDefault();
            if (model == null)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            return model;
        }

        protected List<T> GetModels(FilterDefinition<T> filter)
        {
            var users = _collection.Find(filter).ToList();
            if (users.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            return users;
        }

        protected async Task<List<T>> GetModelsAsync(FilterDefinition<T> filter)
        {
            var users = await _collection.FindAsync(filter);
            var userList = await users.ToListAsync();
            if (userList.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            return userList;
        }
        
        protected T CreateModel(T model)
        {
            var filter = Builders<T>.Filter.Eq(_index, model.GetIndex());
            List<T> models = _collection.Find(filter).ToList();
            if (models.Count != 0)
                throw new InstaBadRequestException(ApplicationConstants.InsertModelExistsException);
            _collection.InsertOne(model);
            return model;
        }
        protected async Task<T> CreateModelAsync(T model)
        {
            var filter = Builders<T>.Filter.Eq(_index, model.GetIndex());
            var modelsFound = await _collection.FindAsync(filter);
            var modelsFoundList = await modelsFound.ToListAsync();
            if (modelsFoundList.Count != 0)
                throw new InstaBadRequestException(ApplicationConstants.InsertModelExistsException);
            await _collection.InsertOneAsync(model);
            return model;
        }

        protected List<T> CreateModels(List<T> models)
        {
            if (models.Count == 0)
                return new List<T>();
            var filter = Builders<T>.Filter.Eq(_index, models.FirstOrDefault().GetIndex());
            bool firstModel = true;
            foreach (var model in models)
            {
                if (!firstModel)
                    filter |= Builders<T>.Filter.Eq(_index, model);
                firstModel = false;
            }
            List<T> modelsFound = _collection.Find(filter).ToList();
            if (modelsFound.Count != 0)
                throw new InstaBadRequestException(ApplicationConstants.InsertModelExistsException);
            _collection.InsertMany(models);
           return models;
        }

        protected async Task<List<T>> CreateModelsAsync(List<T> models)
        {
            if (models.Count == 0)
                return new List<T>();
            var filter = Builders<T>.Filter.Eq(_index, models.FirstOrDefault().GetIndex());
            bool firstModel = true;
            foreach (var model in models)
            {
                if (!firstModel)
                    filter |= Builders<T>.Filter.Eq(_index, model);
                firstModel = false;
            }
            var modelsFound = await _collection.FindAsync(filter);
            var modelsFoundList = await modelsFound.ToListAsync();
            if (modelsFoundList.Count != 0)
                throw new InstaBadRequestException(ApplicationConstants.InsertModelExistsException);
            await _collection.InsertManyAsync(models);
            return models;
        }

        protected T UpdateModel(T updatedModel)
        {
            var update = Builders<T>.Update;
            var updates = new List<UpdateDefinition<T>>();
            var filter = Builders<T>.Filter.Eq(_index, updatedModel.GetIndex());
            var options = new FindOneAndUpdateOptions<T>
            {
                ReturnDocument = ReturnDocument.After
            };
            var properties = from p in updatedModel.GetType().GetProperties()
                             select p;

            foreach (var property in properties)
            {
                var value = property.GetValue(updatedModel, null);
                if (value != null)
                {
                    updates.Add(update.Set(property.Name, value));
                }
            }

            var result = _collection.FindOneAndUpdate(filter, update.Combine(updates), options);
            if (result == null)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            return result;
        }

        protected async Task<T> UpdateModelAsync(T updatedModel)
        {
            var update = Builders<T>.Update;
            var updates = new List<UpdateDefinition<T>>();
            var filter = Builders<T>.Filter.Eq(_index, updatedModel.GetIndex());
            var options = new FindOneAndUpdateOptions<T>
            {
                ReturnDocument = ReturnDocument.After
            };
            var properties = from p in updatedModel.GetType().GetProperties()
                             select p;

            foreach (var property in properties)
            {
                var value = property.GetValue(updatedModel, null);
                if (value != null)
                {
                    updates.Add(update.Set(property.Name, value));
                }
            }

            var result = await _collection.FindOneAndUpdateAsync(filter, update.Combine(updates), options);
            if (result == null)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            return result;
        }

        protected List<T> UpdateModels(List<T> updatedModels)
        {
            var updates = new List<WriteModel<T>>();
            foreach (var model in updatedModels)
            {
                var update = Builders<T>.Update;
                var modelUpdates = new List<UpdateDefinition<T>>();
                var filter = Builders<T>.Filter.Eq(_index, model.GetIndex());
                var properties = from p in model.GetType().GetProperties()
                                 select p;

                foreach (var property in properties)
                {
                    var value = property.GetValue(model, null);
                    if (value != null)
                    {
                        modelUpdates.Add(update.Set(property.Name, value));
                    }
                }
                updates.Add(new UpdateOneModel<T>(filter, update.Combine(modelUpdates)));
            }

            var result = _collection.BulkWrite(updates, new BulkWriteOptions
            {
                IsOrdered = false
            });
            if (!result.IsAcknowledged)
                throw new InstaBadRequestException(string.Format(ApplicationConstants.BadRequestBulkWriteMongoErrorMessage, ApplicationConstants.ModelNames.GetValueOrDefault(updatedModels[0].GetType())));
            else
                return updatedModels;
        }
        protected async Task<List<T>> UpdateModelsAsync(List<T> updatedModels)
        {
            var updates = new List<WriteModel<T>>();
            foreach (var model in updatedModels)
            {
                var update = Builders<T>.Update;
                var modelUpdates = new List<UpdateDefinition<T>>();
                var filter = Builders<T>.Filter.Eq(_index, model.GetIndex());
                var properties = from p in model.GetType().GetProperties()
                                 select p;

                foreach (var property in properties)
                {
                    var value = property.GetValue(model, null);
                    if (value != null)
                    {
                        modelUpdates.Add(update.Set(property.Name, value));
                    }
                }
                updates.Add(new UpdateOneModel<T>(filter, update.Combine(modelUpdates)));
            }

            var result = await _collection.BulkWriteAsync(updates, new BulkWriteOptions
            {
                IsOrdered = false
            });
            if (!result.IsAcknowledged)
                throw new InstaBadRequestException(string.Format(ApplicationConstants.BadRequestBulkWriteMongoErrorMessage, ApplicationConstants.ModelNames.GetValueOrDefault(updatedModels[0].GetType())));
            else
                return updatedModels;
        }

        protected T DeleteModel(FilterDefinition<T> filter)
        {
            var result = _collection.FindOneAndDelete(filter);
            if (result == null)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            return result;
        }
        protected async Task<T> DeleteModelAsync(FilterDefinition<T> filter) 
        {
            var result = await _collection.FindOneAndDeleteAsync(filter);
            if (result == null)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            return result;
        }

        protected List<T> DeleteModels(FilterDefinition<T> filter)
        {
            List<T> models = _collection.Find(filter).ToList();
            if (models.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            var result = _collection.DeleteMany(filter);
            if (result.DeletedCount != models.Count)
                throw new InstaInternalServerException(string.Format(ApplicationConstants.FailedToDeleteMongo, (models.Count - result.DeletedCount).ToString()));
            return result.IsAcknowledged ? models : new List<T>();
        }
        protected async Task<List<T>> DeleteModelsAsync(FilterDefinition<T> filter)
        {
            var modelsFound = await _collection.FindAsync(filter);
            var modelsFoundList = await modelsFound.ToListAsync();
            if (modelsFoundList.Count == 0)
                throw new InstaNotFoundException(ApplicationConstants.NotFoundMongoErrorMessage);
            var result = await _collection.DeleteManyAsync(filter);
            if (result.DeletedCount != modelsFoundList.Count)
                throw new InstaInternalServerException(string.Format(ApplicationConstants.FailedToDeleteMongo, (modelsFoundList.Count - result.DeletedCount).ToString()));
            return result.IsAcknowledged ? modelsFoundList : new List<T>();
        }
    }
}