using FluentValidation;
using InstaConnect.Models;
using Util.Constants;

namespace Backend.Validators.UserValidators
{
    public class UpdateUserValidator: AbstractValidator<UserModel>
    {
        public UpdateUserValidator(ValidatorUserHelpers validator)
        {
            RuleFor(user => user.FirstName).Cascade(CascadeMode.Stop)
                                           .NotEmpty().WithMessage(ApplicationConstants.FirstNameEmpty)
                                           .Must(validator.IsValidName).WithMessage(ApplicationConstants.FirstNameValid);
            RuleFor(user => user.LastName).Cascade(CascadeMode.Stop)
                                          .NotEmpty().WithMessage(ApplicationConstants.LastNameEmpty)
                                          .Must(validator.IsValidName).WithMessage(ApplicationConstants.LastNameValid);
            RuleFor(user => user.BirthDate).Cascade(CascadeMode.Stop)
                                           .NotEmpty().WithMessage(ApplicationConstants.BirthdateEmpty)
                                           .Must(validator.IsValidDate).WithMessage(ApplicationConstants.BirthdateValid);
            RuleFor(user => user.Email).Cascade(CascadeMode.Stop)
                                       .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                       .EmailAddress().WithMessage(ApplicationConstants.EmailValid)
                                        .Must(validator.EmailExists).WithMessage(ApplicationConstants.EmailExists);
        }
    }
}