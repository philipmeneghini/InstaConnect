using Util.MediaType;

namespace Backend.Validators.ContentValidators
{
    public class ValidatorContentHelpers
    {

        public ValidatorContentHelpers()
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

        public bool IsValidDate(string date)
        {
            DateTime dateType;
            return DateTime.TryParse(date, out dateType);
        }

        public bool IsValidMediaType(MediaType media)
        {
            return MediaTypeConverter.TryParse(media);
        }

    }
}

