using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace InstaConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContentController : ControllerBase
    {
        private IContentService _contentService;

        public ContentController(IContentService contentService)
        {
            _contentService = contentService;
        }

        [Authorize]
        [HttpGet("Content")]
        public async Task<ActionResult<ContentModel>> GetContent(string? id)
        {
            return await _contentService.GetContentAsync(id);
        }

        [Authorize]
        [HttpGet("Contents")]
        public async Task<ActionResult<List<ContentModel>>> GetContents(string? email)
        {
            return await _contentService.GetContentsAsync(email);
        }

        [Authorize]
        [HttpPost("Content")]
        public async Task<ActionResult<ContentModel>> PostContent([FromBody] ContentModel? newContent)
        {
            return await _contentService.CreateContentAsync(newContent);
        }

        [Authorize]
        [HttpPost("Contents")]
        public async Task<ActionResult<List<ContentModel>>> PostContents([FromBody] List<ContentModel>? newContents)
        {
            return await _contentService.CreateContentsAsync(newContents);
        }


        [Authorize]
        [HttpPut("Content")]
        public async Task<ActionResult<ContentModel>> PutContent([FromBody]ContentModel? newContent)
        {
            return await _contentService.UpdateContentAsync(newContent);
        }

        [Authorize]
        [HttpPut("Contents")]
        public async Task<ActionResult<List<ContentModel>>> PutContents([FromBody] List<ContentModel>? newContents)
        {
            return await _contentService.UpdateContentsAsync(newContents);
        }

        [Authorize]
        [HttpDelete("Content")]
        public async Task<ActionResult<ContentModel>> DeleteContent(string? id)
        {
            return await _contentService.DeleteContentAsync(id);
        }

        [Authorize]
        [HttpDelete("Contents")]
        public async Task<ActionResult<List<ContentModel>>> DeleteContents([FromBody] List<string>? ids)
        {
            return await _contentService.DeleteContentsAsync(ids);
        }
    }
}