namespace Backend.Validators.ContentValidators
{
    public class ValidatorCommentHelpers : IValidatorHelpers
    {

        public ValidatorCommentHelpers()
        {
        }

        public bool IsHexadecimal(string id)
        {
            foreach (var ch in id)
            {
                char upperCharacter = char.ToUpper(ch);
                if ((upperCharacter < '0' || upperCharacter > '9') &&
                    (upperCharacter < 'A' || upperCharacter > 'F'))
                    return false;
            }
            return true;
        }

    }
}

