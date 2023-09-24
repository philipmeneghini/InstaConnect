using Backend.Models;
using Backend.Validators.ContentValidators;
using FluentValidation;
using Util.Constants;

namespace Backend.Validators.UserValidators
{
    public class CommentModelValidator : AbstractValidator<CommentModel>
    {
        public CommentModelValidator(ValidatorCommentHelpers validator)
        {
            RuleSet(ApplicationConstants.Create, () =>
            {
                RuleFor(model => model.Email).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
                RuleFor(model => model.ContentId).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.ContentIdEmpty)
                                        .Must(validator.IsHexadecimal).WithMessage(ApplicationConstants.ContentIdNotHexadecimal);
                RuleFor(model => model.Body).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.BodyEmpty);
                RuleFor(model => model.DateCreated).Cascade(CascadeMode.Stop)
                                        .Empty().WithMessage(ApplicationConstants.DateCreatedFilled);
                RuleFor(model => model.DateUpdated).Cascade(CascadeMode.Stop)
                                        .Empty().WithMessage(ApplicationConstants.DateUpdatedFilled);
            });

            RuleSet(ApplicationConstants.Update, () =>
            {
                RuleFor(model => model.DateCreated).Cascade(CascadeMode.Stop)
                                        .Empty().WithMessage(ApplicationConstants.DateCreatedFilled);
                RuleFor(model => model.DateUpdated).Cascade(CascadeMode.Stop)
                                        .Empty().WithMessage(ApplicationConstants.DateUpdatedFilled);
            });
        }
    }
}

