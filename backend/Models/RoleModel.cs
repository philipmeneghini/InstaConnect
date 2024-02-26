using Backend.Util;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class RoleModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public Role Role { get; set; }

        public RoleModel(Role role, string email)
        {
            Email = email;
            Role = role;
        }
    }
}