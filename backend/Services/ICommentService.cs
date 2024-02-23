using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ICommentService
    {
        public CommentModel GetComment(string? id);
        public Task<CommentModel> GetCommentAsync(string? id);

        public List<CommentModel> GetComments(string? contentId);
        public List<CommentModel> GetComments(List<string>? ids);
        public Task<List<CommentModel>> GetCommentsAsync(string? contentId);

        public CommentModel CreateComment(CommentModel? comment);
        public Task<CommentModel> CreateCommentAsync(CommentModel? comment);

        public List<CommentModel> CreateComments(List<CommentModel>? newComment);
        public Task<List<CommentModel>> CreateCommentsAsync(List<CommentModel>? newConmment);

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