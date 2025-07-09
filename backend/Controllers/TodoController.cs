using backend.Data;
using backend.DTOs.Todo;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TodoController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetTodoItems()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var todoItems = await _context.TodoItems
                                    .Where(item => item.UserId == userId)
                                    .ToListAsync();

            return Ok(todoItems);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTodoItem([FromBody] TodoItemDto todoItemDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var newTodoItem = new TodoItem
            {
                Title = todoItemDto.Title,
                Description = todoItemDto.Description,
                DueDate = todoItemDto.DueDate,
                Priority = todoItemDto.Priority,
                Status = todoItemDto.Status,
                UserId = userId 
            };

            _context.TodoItems.Add(newTodoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodoItems), new { id = newTodoItem.Id }, newTodoItem);
        }
        
        
    }
}