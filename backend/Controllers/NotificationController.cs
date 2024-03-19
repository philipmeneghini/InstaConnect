using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [Authorize(Policy = "NotificationPolicy")]
        [HttpGet("/Notification")]
        public async Task<NotificationModel> GetNotification([FromQuery] string? id)
        {
            return await _notificationService.GetNotificationAsync(id);
        }

        [Authorize(Policy = "NotificationsPolicy")]
        [HttpGet("/Notifications")]
        public async Task<List<NotificationModel>> GetNotifications([FromQuery] string? email)
        {
            return await _notificationService.GetNotificationsAsync(email);
        }

        [Authorize(Policy = "NotificationPolicy")]
        [HttpDelete("/Notification")]
        public async Task<NotificationModel> DeleteNotification([FromQuery] string? id)
        {
            return await _notificationService.DeleteNotificationAsync(id);
        }

        [Authorize(Policy = "NotificationsPolicy")]
        [HttpDelete("/Notifications")]
        public async Task<List<NotificationModel>> DeleteNotificatiosn([FromQuery] string? email)
        {
            return await _notificationService.DeleteNotificationsAsync(email);
        }
    }
}
