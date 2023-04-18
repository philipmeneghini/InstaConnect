using System.Net.Mail;

namespace Backend.Util
{
    public class ContactValidator
    {
        public static bool isEmailValid(string? email)
        {
            try
            {
                var emailAddress = new MailAddress(email);
                return emailAddress.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
