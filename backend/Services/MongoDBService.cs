using MongoDB.Driver;
using InstaConnect.Models;
using Backend.Services;
using Util.Constants;
using Microsoft.Extensions.Options;
using Backend.Models;
using MongoDB.Bson;
using Amazon.S3.Model;
using Microsoft.VisualBasic;

namespace InstaConnect.Services
{
    public class MongoDbService<T> : IMongoDbService<T>
    {
        private MongoClient _dbClient;
        private IMongoDatabase _database;
        private IMongoCollection<T> _collection;

        public MongoDbService(IOptions<ConnectionStringModel> connectionStrings)
        {
            _dbClient = new MongoClient(connectionStrings.Value.MongoDb);
            _database = _dbClient.GetDatabase(ApplicationConstants.DatabaseName);
            _collection = _database.GetCollection<T>(CollectionName[T]);
        }
        public string? GetTest()
        {
            IMongoCollection <TestModel> collection = _database.GetCollection<TestModel>(ApplicationConstants.TestCollectionName);
            return collection.Find(new BsonDocument()).FirstOrDefault().Test;
        }

        public IMongoCollection<UserModel> GetUserCollection()
        {
            return _database.GetCollection<UserModel>(ApplicationConstants.UserCollectionName);
        }

        public T GetModel(FilterDefinition<T> filter)
        {
            IFindFluent<T,T> result =  _collection.Find<T>(filter);
            return result.Single();
        }
        public async Task<T> GetModelAsync(FilterDefinition<T> filter)
        {
            var result = await _collection.FindAsync<T>(filter);
            return result.Single();
        }

        public List<T>? GetModels(FilterDefinition<T> filter)
        {
            return _collection.Find(filter).ToList<T>();
        }
        public async Task<List<T>?> GetModelsAsync(FilterDefinition<T> filter)
        {
            return await _collection.Find(filter).ToListAsync<T>();
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

        public UpdateResult UpdateModel(FilterDefinition<T> filter, UpdateDefinition<T> update)
        {
            return _collection.UpdateOne(filter, update);
        }
        public async Task<UpdateResult> UpdateModelAsync(FilterDefinition<T> filter, UpdateDefinition<T> update)
        {
            return await _collection.UpdateOneAsync(filter, update);
        }

        public UpdateResult UpdateModels(FilterDefinition<T> filter, UpdateDefinition<T> update)
        {
            return _collection.UpdateMany(filter, update);
        }
        public async Task<UpdateResult> UpdateModelsAsync(FilterDefinition<T> filter, UpdateDefinition<T> update)
        {
            return await _collection.UpdateManyAsync(filter, update);
        }

        public DeleteResult DeleteModel(FilterDefinition<T> filter)
        {
            return _collection.DeleteOne(filter);
       ;
        }
        public async Task<DeleteResult> DeleteModelAsync(FilterDefinition<T> filter)
        {
             return await _collection.DeleteOneAsync(filter);
        }

        public DeleteResult DeleteModels(FilterDefinition<T> filter)
        {
            return _collection.DeleteMany(filter);
        }
        public async Task<DeleteResult> DeleteModelsAsync(FilterDefinition<T> filter)
        {
            return await _collection.DeleteManyAsync(filter);
        }
    }
}