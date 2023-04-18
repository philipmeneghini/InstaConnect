﻿using FluentValidation;
using InstaConnect.Models;
using Util.Constants;

namespace Backend.Validators.UserValidators
{
    public class CreateUpdateUserValidator: AbstractValidator<UserModel>
    {
        public CreateUpdateUserValidator(ValidatorUserHelpers validator)
        {
            RuleSet(ApplicationConstants.Create, () =>
            {
                RuleFor(user => user.Email).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
                RuleFor(user => user.FirstName).Cascade(CascadeMode.Stop)
                                                .NotEmpty().WithMessage(ApplicationConstants.FirstNameEmpty)
                                                .Must(validator.IsValidName).WithMessage(ApplicationConstants.FirstNameValid);
                RuleFor(user => user.LastName).Cascade(CascadeMode.Stop)
                                              .NotEmpty().WithMessage(ApplicationConstants.LastNameEmpty)
                                              .Must(validator.IsValidName).WithMessage(ApplicationConstants.LastNameValid);
                RuleFor(user => user.BirthDate).Cascade(CascadeMode.Stop)
                                               .NotEmpty().WithMessage(ApplicationConstants.BirthdateEmpty)
                                               .Must(validator.IsValidDate).WithMessage(ApplicationConstants.BirthdateValid);
            });

            RuleSet(ApplicationConstants.Update, () =>
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
                                           .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
            });
        }
    }
}