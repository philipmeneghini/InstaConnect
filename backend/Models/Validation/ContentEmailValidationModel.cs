namespace Backend.Models.Validation
{
    public class ContentEmailValidationModel
    {
        public ContentEmailValidationModel(string? email)
        {
            Email = email;
        }

        public string? Email { get; set; }

    }
}
