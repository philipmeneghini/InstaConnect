using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace InstaConnect.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ContentController : ControllerBase
    {
        private IContentService _contentService;

        public ContentController(IContentService contentService)
        {
            _contentService = contentService;
        }

        [HttpGet("Content")]
        public async Task<ActionResult<ContentModel>> GetContent([FromQuery] string? id)
        {
            return await _contentService.GetContentAsync(id);
        }

        [HttpGet("Contents")]
        public async Task<ActionResult<List<ContentModel>>> GetContents([FromQuery] List<string>? ids, 
                                                                        [FromQuery] List<string>? emails)
        {
            return await _contentService.GetContentsAsync(ids, emails);
        }

        [Authorize(Policy = "ContentPolicy")]
        [HttpPost("Content")]
        public async Task<ActionResult<ContentModel>> PostContent([FromBody] ContentModel? newContent)
        {
            return await _contentService.CreateContentAsync(newContent);
        }

        [Authorize(Policy = "ContentPolicy")]
        [HttpPost("Contents")]
        public async Task<ActionResult<List<ContentModel>>> PostContents([FromBody] List<ContentModel>? newContents)
        {
            return await _contentService.CreateContentsAsync(newContents);
        }


        [Authorize(Policy = "ContentPolicy")]
        [HttpPut("Content")]
        public async Task<ActionResult<ContentModel>> PutContent([FromBody]ContentModel? newContent)
        {
            return await _contentService.UpdateContentAsync(newContent);
        }

        [Authorize(Policy = "ContentPolicy")]
        [HttpPut("Contents")]
        public async Task<ActionResult<List<ContentModel>>> PutContents([FromBody] List<ContentModel>? newContents)
        {
            return await _contentService.UpdateContentsAsync(newContents);
        }

        [Authorize(Policy = "ContentDeletePolicy")]
        [HttpDelete("Content")]
        public async Task<ActionResult<ContentModel>> DeleteContent([FromQuery]string? id)
        {
            return await _contentService.DeleteContentAsync(id);
        }

        [Authorize(Policy = "ContentDeletePolicy")]
        [HttpDelete("Contents")]
        public async Task<ActionResult<List<ContentModel>>> DeleteContents([FromQuery] List<string>? ids)
        {
            return await _contentService.DeleteContentsAsync(ids);
        }
    }
}