using Backend.Models.Config;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private string _email;
        private string _host;
        private int _port;
        private string _username;
        private string _password;

        public EmailService(IOptions<AmazonEmailSettings> settings)
        {
            _email = settings.Value.Email;
            _host = settings.Value.Host;
            _port = settings.Value.Port;
            _username = settings.Value.Username;
            _password = settings.Value.Password;
        }

        public async Task SendEmail(string reciever, string subject, string message)
        {
            var smtpClient = new SmtpClient(_host, _port)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(_username, _password)
            };

            await smtpClient.SendMailAsync(
                new MailMessage(from: _email,
                                to: reciever,
                                subject,
                                message));
        }
    }
}
