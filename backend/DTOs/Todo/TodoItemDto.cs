using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Todo
{
    public class TodoItemDto
    {
        [Required]
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public TodoPriority Priority { get; set; }
        public TodoStatus Status { get; set; }
    }
}