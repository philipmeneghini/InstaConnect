using Backend.Models.Config;
using Microsoft.Extensions.Options;
using Amazon.SimpleEmail;
using Util.Constants;
using Amazon.Runtime;
using Amazon;
using Amazon.SimpleEmail.Model;
using Backend.Models;
using Backend.Services.Interfaces;
using System.Net;
using Util.Exceptions;
using FluentValidation;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private IAmazonSimpleEmailService _client;
        private AmazonCredentialsModel _keys;
        private IAuthService _authService;
        private IValidator<UserModel> _emailServiceValidator;

        public EmailService(IOptionsSnapshot<AmazonCredentialsModel> settings, IValidator<UserModel> emailServiceValidator,  IAuthService authService)
        {
            _keys = settings.Get(ApplicationConstants.SES);
            var credentials = new BasicAWSCredentials(_keys.AccessKey, _keys.SecretKey);
            _client = new AmazonSimpleEmailServiceClient(credentials, RegionEndpoint.USEast1);
            _authService = authService;
            _emailServiceValidator = emailServiceValidator;
        }

        public async Task<bool> SendRegistrationEmailAsync(UserModel user)
        {
            if (user == null) throw new InstaBadRequestException(ApplicationConstants.UserEmpty);
            var validationResult = _emailServiceValidator.Validate(user, options => options.IncludeRuleSets(ApplicationConstants.EmailService));
            ThrowExceptions(validationResult);
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
            if (emailResponse.HttpStatusCode == HttpStatusCode.OK)
                return true;
            else
                return false;
        }

        private void ThrowExceptions(FluentValidation.Results.ValidationResult validationResult)
        {
            foreach (var failure in validationResult.Errors)
            {
                if (ApplicationConstants.EmailServicerBadRequestErrorMessages.Contains(failure.ErrorMessage, StringComparer.OrdinalIgnoreCase))
                    throw new InstaBadRequestException(failure.ErrorMessage);
                else
                    throw new Exception(failure.ErrorMessage);
            }
        }
    }
}
