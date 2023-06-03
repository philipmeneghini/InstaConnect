using Backend.Models.Validation;
using FluentValidation;
using Util.Constants;

namespace Backend.Validators.UserValidators
{
    public class UserEmailValidator : AbstractValidator<UserEmailValidationModel>
    {
        public UserEmailValidator()
        {
            RuleSet(ApplicationConstants.Delete, () =>
            {
                RuleFor(model => model.Email).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
            });

            RuleSet(ApplicationConstants.Get, () =>
            {
                RuleFor(model => model.Email).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
            });
        }
    }
}
