using FluentValidation;
using Backend.Models;
using Util.Constants;

namespace Backend.Validators.ContentValidators
{
    public class ContentModelValidator : AbstractValidator<ContentModel>
    {
        public ContentModelValidator(ValidatorContentHelpers validator)
        {
            RuleSet(ApplicationConstants.Create, () =>
            {
                RuleFor(content => content.Email).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
                RuleFor(content => content.MediaType).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.MediaTypeEmpty)
                                        .Must(validator.IsValidMediaType).WithMessage(ApplicationConstants.MediaTypeNotValid);
            });

            RuleSet(ApplicationConstants.Update, () =>
            {
                RuleFor(content => content.Email).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
            });
        }
    }
}