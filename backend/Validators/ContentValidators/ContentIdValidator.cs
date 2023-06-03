﻿using Backend.Models.Validation;
using Backend.Validators.ContentValidators;
using FluentValidation;
using Util.Constants;

namespace Backend.Validators.UserValidators
{
    public class ContentIdValidator : AbstractValidator<ContentIdValidationModel>
    {
        public ContentIdValidator(ValidatorContentHelpers validator)
        {
            RuleSet(ApplicationConstants.Delete, () =>
            {
                RuleFor(model => model.Id).Cascade(CascadeMode.Stop)
                                         .NotEmpty().WithMessage(ApplicationConstants.ContentIdEmpty)
                                         .Must(validator.IsHexadecimal).WithMessage(ApplicationConstants.ContentIdNotHexadecimal);
            });

            RuleSet(ApplicationConstants.Get, () =>
            {
                RuleFor(model => model.Id).Cascade(CascadeMode.Stop)
                                         .NotEmpty().WithMessage(ApplicationConstants.ContentIdEmpty)
                                         .Must(validator.IsHexadecimal).WithMessage(ApplicationConstants.ContentIdNotHexadecimal);
            });
        }
    }
}
