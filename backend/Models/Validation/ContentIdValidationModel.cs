namespace Backend.Models.Validation
{
    public class ContentIdValidationModel
    {
        public ContentIdValidationModel(string? id)
        {
            Id = id;
        }

        public string? Id { get; set; }

    }
}
