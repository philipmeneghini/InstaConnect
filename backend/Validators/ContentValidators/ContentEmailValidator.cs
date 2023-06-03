using Backend.Models.Validation;
using FluentValidation;
using Util.Constants;

namespace Backend.Validators.UserValidators
{
    public class ContentEmailValidator : AbstractValidator<ContentEmailValidationModel>
    {
        public ContentEmailValidator()
        {
            RuleSet(ApplicationConstants.Get, () =>
            {
                RuleFor(model => model.Email).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
            });
        }
    }
}

