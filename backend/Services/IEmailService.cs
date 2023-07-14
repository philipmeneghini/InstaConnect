namespace Backend.Services
{
    public interface IEmailService
    {
        public Task SendEmail(string reciever, string subject, string message);
    }
}