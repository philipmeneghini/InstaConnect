using Backend.Services;
using FluentValidation;
using InstaConnect.Models;
using MongoDB.Driver;
using Util.Constants;

namespace Backend.Validators.UserValidators
{
    public class DeleteGetUserValidator : AbstractValidator<string>
    {
        public DeleteGetUserValidator(ValidatorUserHelpers validator)
        {
            RuleSet(ApplicationConstants.Delete, () =>
            {
                RuleFor(email => email).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
            });

            RuleSet(ApplicationConstants.Get, () =>
            {
                RuleFor(email => email).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
            });
        }
    }
}
