// File: backend/DTOs/Admin/UpdateUserRoleDto.cs
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admin
{
    public class UpdateUserRoleDto
    {
        [Required]
        public string? UserId { get; set; }

        [Required]
        public string? RoleName { get; set; }
    }
}