using MongoDB.Driver;
using InstaConnect.Models;
using Backend.Services;
using Util.Constants;
using Microsoft.Extensions.Options;
using Backend.Models;
using MongoDB.Bson;
using System.Xml;

namespace InstaConnect.Services
{
    public class MongoDbService<T> : IMongoDbService<T> where T : IInstaModel
    {
        private MongoClient _dbClient;
        private IMongoDatabase _database;
        private IMongoCollection<T> _collection;
        private string _index;

        public MongoDbService(IOptions<SettingsModel<T>> settings)
        {
            _dbClient = new MongoClient(settings.Value.ConnectionString);
            _database = _dbClient.GetDatabase(ApplicationConstants.DatabaseName);
            _collection = _database.GetCollection<T>(settings.Value.Collection);
            _index = settings.Value.Index;
        }

        public T GetModel(object id)
        {
            var filter = Builders<T>.Filter.Eq(_index, id);
            IFindFluent<T,T> result= _collection.Find(filter);
            return result.Single();
        }
        public async Task<T> GetModelAsync(object id)
        {
            var filter = Builders<T>.Filter.Eq(_index, id);
            var result = await _collection.FindAsync(filter);
            return result.Single();
        }

        public List<T> GetModels(FilterDefinition<T> filter) 
        {
            var users = _collection.Find(filter).ToList();
            return users;
        }

        public async Task<List<T>> GetModelsAsync(FilterDefinition<T> filter)
        {
            var users = await _collection.Find(filter).ToListAsync();
            return users;
        }
        
        public T CreateModel(T model)
        {
            _collection.InsertOne(model);
            return model;
        }
        public async Task<T> CreateModelAsync(T model)
        {
            await _collection.InsertOneAsync(model);
            return model;
        }

        public List<T> CreateModels(List<T> models)
        {
           _collection.InsertMany(models);
           return models;
        }
        public async Task<List<T>> CreateModelsAsync(List<T> models)
        {
            await _collection.InsertManyAsync(models);
            return models;
        }

        public T? UpdateModel(T updatedModel)
        {
            var filter = Builders<T>.Filter.Eq(_index, updatedModel.GetIndex());
            var update = Builders<T>.Update.Set(t => t, updatedModel);
            var result = _collection.UpdateOne(filter, update);
            return (result.IsAcknowledged? updatedModel : default(T));
        }

        public async Task<T?> UpdateModelAsync(T updatedModel)
        {
            var filter = Builders<T>.Filter.Eq(_index, updatedModel.GetIndex());
            var update = Builders<T>.Update.Set(t => t, updatedModel);
            var result = await _collection.UpdateOneAsync(filter, update);
            return (result.IsAcknowledged ? updatedModel : default(T));
        }

        public List<T> UpdateModels(List<T> updatedModels)
        {
            List<T> finishedModels = new List<T> ();
            foreach (var model in updatedModels)
            {
                var filter = Builders<T>.Filter.Eq(_index, model.GetIndex());
                var update = Builders<T>.Update.Set(t => t, model);
                var result = _collection.UpdateOne(filter, update);
                if (result.IsAcknowledged)
                {
                    finishedModels.Add(model);
                }

            }
            return finishedModels;
        }
        public async Task<List<T>> UpdateModelsAsync(List<T> updatedModels)
        {
            List<T> finishedModels = new List<T>();
            foreach (var model in updatedModels)
            {
                var filter = Builders<T>.Filter.Eq(_index, model.GetIndex());
                var update = Builders<T>.Update.Set(t => t, model);
                var result = await _collection.UpdateOneAsync(filter, update);
                if (result.IsAcknowledged)
                {
                    finishedModels.Add(model);
                }

            }
            return finishedModels;
        }

        public T? DeleteModel(object id)
        {
            var filter = Builders<T>.Filter.Eq(_index, id);
            T model = _collection.Find(filter).Single();
            var result = _collection.DeleteOne(filter);
            return result.IsAcknowledged ? model : default;
        }
        public async Task<T?> DeleteModelAsync(object id) 
        {
            var filter = Builders<T>.Filter.Eq(_index, id);
            T model = _collection.Find(filter).Single();
             var result = await _collection.DeleteOneAsync(filter);
            return result.IsAcknowledged ? model : default;
        }

        public List<T> DeleteModels(FilterDefinition<T> filter)
        {
            List<T> models = _collection.Find(filter).ToList();
            var result = _collection.DeleteMany(filter);
            return result.IsAcknowledged ? models : new List<T>();
        }
        public async Task<List<T>> DeleteModelsAsync(FilterDefinition<T> filter)
        {
            List<T> models = _collection.Find(filter).ToList();
            var result = await _collection.DeleteManyAsync(filter);
            return result.IsAcknowledged ? models : new List<T>();
        }
    }
}