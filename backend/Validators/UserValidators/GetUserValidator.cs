using Backend.Services;
using FluentValidation;
using InstaConnect.Models;
using MongoDB.Driver;
using Util.Constants;

namespace Backend.Validators.UserValidators
{
    public class GetUserValidator : AbstractValidator<string>
    {
        public GetUserValidator(ValidatorUserHelpers validator)
        {
            RuleFor(email => email).Cascade(CascadeMode.StopOnFirstFailure)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid)
                                        .Must(validator.EmailExists).WithMessage(ApplicationConstants.EmailExists);
        }
    }
}
