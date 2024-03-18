namespace Backend.Services
{
    public interface INotificationHub
    {
        public Task SendNotification(string user, string message);

        public Task<string> GetConnectionId(string? jwtToken);
    }
}