using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admin
{
    public class SetUserStatusDto
    {
        [Required]
        public bool IsActive { get; set; }
    }
}