namespace Backend.Validators.UserValidators
{
    public class ValidatorUserHelpers : IValidatorHelpers
    {

        public ValidatorUserHelpers()
        {
        }

        public bool IsValidName(string name)
        {
            return name.All(char.IsLetter);
        }

        public bool IsValidDate(string date)
        {
            DateTime dateType;
            return DateTime.TryParse(date, out dateType);
        }

    }
}
