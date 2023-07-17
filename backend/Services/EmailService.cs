using Backend.Models.Config;
using Microsoft.Extensions.Options;
using Amazon.SimpleEmail;
using Util.Constants;
using Amazon.Runtime;
using Amazon;
using Amazon.SimpleEmail.Model;
using Backend.Models;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private IAmazonSimpleEmailService _client;
        private AmazonCredentialsModel _keys;
        private IAuthService _authService;

        public EmailService(IOptionsSnapshot<AmazonCredentialsModel> settings, IAuthService authService)
        {
            _keys = settings.Get(ApplicationConstants.SES);
            var credentials = new BasicAWSCredentials(_keys.AccessKey, _keys.SecretKey);
            _client = new AmazonSimpleEmailServiceClient(credentials, RegionEndpoint.USEast1);
            _authService = authService;
        }

        public async Task SendRegistrationEmailAsync(UserModel user)
        {
            string jwt = _authService.GenerateToken(user);
            string url = string.Format(ApplicationConstants.RegistrationURL, jwt);
            var sendEmailRequest = new SendEmailRequest(ApplicationConstants.InstaConnectEmail,
                new Destination(new List<string>() { user.Email }),
                new Message
                {
                    Subject = new Content
                    {
                        Charset = ApplicationConstants.UTF8,
                        Data = ApplicationConstants.RegistrationSubject
                    },
                    Body = new Body
                    {
                        Text = new Content
                        {
                            Charset = ApplicationConstants.UTF8,
                            Data = string.Format(ApplicationConstants.RegistrationBody, user.FirstName, url)
                        }
                    }
                });
            var emailResponse = await _client.SendEmailAsync(sendEmailRequest);
        }        
    }
}
