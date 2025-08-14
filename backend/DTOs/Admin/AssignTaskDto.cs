// File: backend/DTOs/Admin/AssignTaskDto.cs
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admin
{
    public class AssignTaskDto
    {
        [Required]
        public string? NewUserId { get; set; }
    }
}