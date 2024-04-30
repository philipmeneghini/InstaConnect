using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private ISearchService<UserModel> _userService;

        private ISearchService<ContentModel> _contentService;

        public SearchController(ISearchService<UserModel> userService, ISearchService<ContentModel> contentService)
        {
            _userService = userService;
            _contentService = contentService;
        }

        [HttpGet("Users/Search")]
        public async Task<List<UserModel>> GetUserSearch([FromQuery] string? searchParam)
        {
            return await _userService.GetSearchAsync(searchParam);
        }

        [HttpGet("Content/Search")]
        public async Task<List<ContentModel>> GetContentSearch([FromQuery] string? searchParam)
        {
            return await _contentService.GetSearchAsync(searchParam);
        }
    }
}
