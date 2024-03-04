using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IContentService
    {
        public ContentModel GetContent(string? id);
        public Task<ContentModel> GetContentAsync(string? id);

        public List<ContentModel> GetContents(string? email);
        public List<ContentModel> GetContents(List<string> ids);
        public Task<List<ContentModel>> GetContentsAsync(string? email);

        public ContentModel CreateContent(ContentModel? content);
        public Task<ContentModel> CreateContentAsync(ContentModel? content);

        public List<ContentModel> CreateContents(List<ContentModel>? newContent);
        public Task<List<ContentModel>> CreateContentsAsync(List<ContentModel>? newContent);

        public ContentModel UpdateContent(ContentModel? updatedContent);
        public Task<ContentModel> UpdateContentAsync(ContentModel? updatedContent);

        public List<ContentModel> UpdateContents(List<ContentModel>? updatedContents);
        public Task<List<ContentModel>> UpdateContentsAsync(List<ContentModel>? updatedContents);

        public ContentModel DeleteContent(string? id);
        public Task<ContentModel> DeleteContentAsync(string? id);

        public List<ContentModel> DeleteContents(List<string>? ids);
        public Task<List<ContentModel>> DeleteContentsAsync(List<string>? ids);
    }
}