using Backend.Models;
using FluentValidation;
using Util.Constants;

namespace Backend.Validators.NotificationValidators
{
    public class NotificationModelValidator : AbstractValidator<NotificationModel>
    {
        public NotificationModelValidator()
        {
            RuleSet(ApplicationConstants.Create, () =>
            {
                RuleFor(notification => notification.Reciever).Cascade(CascadeMode.Stop)
                                        .NotEmpty().WithMessage(ApplicationConstants.EmailEmpty)
                                        .EmailAddress().WithMessage(ApplicationConstants.EmailValid);
                RuleFor(notification => notification.Read).Cascade(CascadeMode.Stop)
                                                .Equal(false).WithMessage(ApplicationConstants.ReadFalse);
                RuleFor(notification => notification.Body).Cascade(CascadeMode.Stop)
                                                .NotNull().WithMessage(ApplicationConstants.NotificationBodyEmpty)
                                                .NotEmpty().WithMessage(ApplicationConstants.NotificationBodyEmpty);
            });
        }
    }
}
