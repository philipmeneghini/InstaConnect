using Backend.Services;
using FluentValidation;
using InstaConnect.Models;
using MongoDB.Driver;
using Util.Constants;

namespace Backend.Validators.UserValidators
{
    public class DeleteUserValidator : AbstractValidator<string>
    {
        public DeleteUserValidator(ValidatorUserHelpers validator)
        {
            RuleFor(email => email).Cascade(CascadeMode.StopOnFirstFailure)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid)
                                        .Must(validator.EmailExists).WithMessage(ApplicationConstants.EmailExists);
        }
    }
}
