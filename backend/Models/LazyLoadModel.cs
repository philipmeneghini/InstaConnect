using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class LazyLoadModel
    {
        [Required]
        public int Index { get; set; } = 0;

        [Required]
        public int Limit { get; set; }

        public LazyLoadModel(int? index, int limit)
        {
            Index = index ?? 0;
            Limit = limit;
        }
    }
}
