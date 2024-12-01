using Backend.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace Backend.Services.Interfaces
{
    public interface ICommentService
    {
        public CommentModel GetComment(string? id);
        public Task<CommentModel> GetCommentAsync(string? id);

        public long GetNumberOfComments(string? contentId);
        public Task<long> GetNumberOfCommentsAsync(string? contentId);

        public List<CommentModel> GetComments(List<string>? ids, List<string>? contentIds, DateTime? lastDate = null, int? limit = null);
        public Task<List<CommentModel>> GetCommentsAsync(List<string>? ids, List<string>? contentIds, DateTime? lastDate = null, int? limit = null);

        public CommentModel CreateComment(CommentModel? comment);
        public Task<CommentModel> CreateCommentAsync(CommentModel? comment);

        public List<CommentModel> CreateComments(List<CommentModel>? newComment);
        public Task<List<CommentModel>> CreateCommentsAsync(List<CommentModel>? newConmment);

        public CommentModel PatchComment(string? id, JsonPatchDocument<CommentModel>? updates);
        public Task<CommentModel> PatchCommentAsync(string? id, JsonPatchDocument<CommentModel>? updates);

        public List<CommentModel> PatchComments(List<string>? ids, JsonPatchDocument<CommentModel>? updates);
        public Task<List<CommentModel>> PatchCommentsAsync(List<string>? ids, JsonPatchDocument<CommentModel>? updates);

        public CommentModel UpdateComment(CommentModel? updatedComment);
        public Task<CommentModel> UpdateCommentAsync(CommentModel? updatedComment);

        public List<CommentModel> UpdateComments(List<CommentModel>? updatedComments);
        public Task<List<CommentModel>> UpdateCommentsAsync(List<CommentModel>? updatedComments);

        public CommentModel DeleteComment(string? id);
        public Task<CommentModel> DeleteCommentAsync(string? id);

        public List<CommentModel> DeleteComments(List<string>? ids);
        public Task<List<CommentModel>> DeleteCommentsAsync(List<string>? ids);
    }
}