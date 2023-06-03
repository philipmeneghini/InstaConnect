namespace Backend.Models.Validation
{
    public class UserEmailValidationModel
    {
        public UserEmailValidationModel(string? email)
        {
            Email = email;
        }

        public string? Email { get; set; }
    }
}
