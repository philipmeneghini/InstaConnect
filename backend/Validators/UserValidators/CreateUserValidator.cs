using FluentValidation;
using InstaConnect.Models;

namespace Backend.Validators.UserValidators
{
    public class CreateUserValidator: AbstractValidator<UserModel>
    {
        public CreateUserValidator()
        {
            RuleFor(user => user.FirstName).NotEmpty();
            RuleFor(user => user.LastName).NotEmpty();
            RuleFor(user => user.BirthDate).NotEmpty();
            RuleFor(user => user.Email).EmailAddress();
        }
    }
}
