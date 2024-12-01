using Backend.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace Backend.Services.Interfaces
{
    public interface IContentService
    {
        public ContentModel GetContent(string? id);
        public Task<ContentModel> GetContentAsync(string? id);

        public long GetNumberOfContents(string? email);
        public Task<long> GetNumberOfContentsAsync(string? email);

        public List<ContentModel> GetContents(List<string>? ids, List<string>? email, DateTime? lastDate = null, int? limit = null);
        public Task<List<ContentModel>> GetContentsAsync(List<string>? ids, List<string>? email, DateTime? lastDate = null, int? limit = null);

        public ContentModel CreateContent(ContentModel? content);
        public Task<ContentModel> CreateContentAsync(ContentModel? content);

        public List<ContentModel> CreateContents(List<ContentModel>? newContent);
        public Task<List<ContentModel>> CreateContentsAsync(List<ContentModel>? newContent);

        public ContentModel PatchContent(string? id, JsonPatchDocument<ContentModel>? updates);
        public Task<ContentModel> PatchContentAsync(string? id, JsonPatchDocument<ContentModel>? updates);

        public List<ContentModel> PatchContents(List<string>? ids, JsonPatchDocument<ContentModel>? updates);
        public Task<List<ContentModel>> PatchContentsAsync(List<string>? ids, JsonPatchDocument<ContentModel>? updates);

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