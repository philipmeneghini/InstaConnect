using Backend.Models;
using InstaConnect.Models;
using MongoDB.Driver;

namespace Backend.Services
{
    public interface IMongoDbService<T> where T : IInstaModel
    {
        public T GetModel(object id);
        public Task<T> GetModelAsync(object id);

        public List<T> GetModels(FilterDefinition<T> filter);
        public Task<List<T>> GetModelsAsync(FilterDefinition<T> filter);

        public T CreateModel(T model);
        public Task<T> CreateModelAsync(T model);

        public List<T> CreateModels(List<T> models);
        public Task<List<T>> CreateModelsAsync(List<T> models);

        public T UpdateModel(T updatedModels);
        public Task<T> UpdateModelAsync(T updatedModels);

        public List<T> UpdateModels(List<T> updatedModels);
        public Task<List<T>> UpdateModelsAsync(List<T> updatedModels);

        public T? DeleteModel(object id);
        public Task<T?> DeleteModelAsync(object id);

        public List<T> DeleteModels(FilterDefinition<T> filter);
        public Task<List<T>> DeleteModelsAsync(FilterDefinition<T> filter);
    }
}
