namespace Backend.Services
{
    public interface INotificationHub
    {
        public Task SendNotification(string user, string type);

        public Task<string> GetConnectionId(string? jwtToken);
    }
}
