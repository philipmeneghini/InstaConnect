namespace Backend.Models.Validation
{
    public class CommentIdValidationModel
    {
        public CommentIdValidationModel(string? id)
        {
            Id = id;
        }

        public string? Id { get; set; }

    }
}
