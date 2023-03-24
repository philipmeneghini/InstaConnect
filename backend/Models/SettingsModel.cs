namespace Backend.Models
{
    public class SettingsModel<T> where T : IInstaModel
    {
        public string? Collection { get; set; }

        public string? ConnectionString { get; set; }

        public string? Index { get; set; }
    }
}
