using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace InstaConnect.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CommentController : ControllerBase
    {
        private ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("Comment")]
        public async Task<ActionResult<CommentModel>> GetComment(string? id)
        {
            return await _commentService.GetCommentAsync(id);
        }

        [HttpGet("Comments")]
        public async Task<ActionResult<List<CommentModel>>> GetContents(string? contentId)
        {
            return await _commentService.GetCommentsAsync(contentId);
        }

        [Authorize(Policy = "CommentPolicy")]
        [HttpPost("Comment")]
        public async Task<ActionResult<CommentModel>> PostComment([FromBody] CommentModel? newComment)
        {
            return await _commentService.CreateCommentAsync(newComment);
        }

        [Authorize(Policy = "CommentPolicy")]
        [HttpPost("Comments")]
        public async Task<ActionResult<List<CommentModel>>> PostComments([FromBody] List<CommentModel>? newComments)
        {
            return await _commentService.CreateCommentsAsync(newComments);
        }


        [Authorize(Policy = "CommentPolicy")]
        [HttpPut("Comment")]
        public async Task<ActionResult<CommentModel>> PutComment([FromBody]CommentModel? newComment)
        {
            return await _commentService.UpdateCommentAsync(newComment);
        }

        [Authorize(Policy = "CommentPolicy")]
        [HttpPut("Comments")]
        public async Task<ActionResult<List<CommentModel>>> PutComments([FromBody] List<CommentModel>? newComments)
        {
            return await _commentService.UpdateCommentsAsync(newComments);
        }

        [Authorize(Policy = "CommentPolicy")]
        [HttpDelete("Comment")]
        public async Task<ActionResult<CommentModel>> DeleteComment(string? id)
        {
            return await _commentService.DeleteCommentAsync(id);
        }

        [Authorize(Policy = "CommentPolicy")]
        [HttpDelete("Comments")]
        public async Task<ActionResult<List<CommentModel>>> DeleteComments([FromBody] List<string>? ids)
        {
            return await _commentService.DeleteCommentsAsync(ids);
        }
    }
}