namespace Backend.Models
{
    public class HashSettings
    {
        public int Iterations { get; set; }

        public int KeySize { get; set; }

        public int SaltSize { get; set; }
    }
}
