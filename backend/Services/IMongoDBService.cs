using Backend.Models;
using InstaConnect.Models;
using MongoDB.Driver;

namespace Backend.Services
{
    public interface IMongoDbService<T> where T : IInstaModel
    {
        public T GetModel(Guid id);
        public Task<T> GetModelAsync(Guid id);

        public IEnumerable<T> GetModels(IEnumerable<Guid> ids);
        public Task<IEnumerable<T>> GetModelsAsync(IEnumerable<Guid> ids);

        public T CreateModel(T model);
        public Task<T> CreateModelAsync(T model);

        public IEnumerable<T> CreateModels(IEnumerable<T> models);
        public Task<IEnumerable<T>> CreateModelsAsync(IEnumerable<T> models);

        public T UpdateModel(T model);
        public Task<T> UpdateModelAsync(T model);

        public IEnumerable<T> UpdateModels(IEnumerable<T> models);
        public Task<IEnumerable<T>> UpdateModelsAsync(IEnumerable<T> models);

        public T DeleteModel(Guid id);
        public Task<T> DeleteModelAsync(Guid id);

        public IEnumerable<T> DeleteModels(IEnumerable<Guid> ids);
        public Task<IEnumerable<T>> DeleteModelsAsync(IEnumerable<Guid> ids);
    }
}
