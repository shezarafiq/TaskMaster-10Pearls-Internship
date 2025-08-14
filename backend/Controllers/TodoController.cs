using backend.Data;
using backend.DTOs.Todo;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly ILogger<ProfileController> _logger;

        public TodoController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, ILogger<ProfileController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger; 

        }

        // [HttpGet]
        // public async Task<IActionResult> GetTodoItems()
        // {
        //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //     var todoItems = await _context.TodoItems
        //                             .Where(item => item.UserId == userId)
        //                             .ToListAsync();

        //     return Ok(todoItems);
        // }
    [HttpGet]
public async Task<IActionResult> GetTodoItems()
{
    // Get the full user object for the currently logged-in user
    var currentUser = await _userManager.GetUserAsync(User);
    if (currentUser == null)
    {
        return Unauthorized();
    }

    // Get the roles for that specific user
    var userRoles = await _userManager.GetRolesAsync(currentUser);

    // Check if "Admin" is one of their roles
    var isAdmin = userRoles.Contains("Admin");

    // Start building the query
    IQueryable<TodoItem> query = _context.TodoItems;

            if (isAdmin)
            {
                // Admin sees all tasks. For clarity, let's include the user info.
                // .Include(item => item.User) will join the AspNetUsers table.
                query = query.Include(item => item.User);
                _logger.LogInformation("Admin '{UserName}' is fetching all tasks.", currentUser.UserName);
            }
            else
            {
                // Regular user sees only their own tasks
                query = query.Where(item => item.UserId == currentUser.Id);
                _logger.LogInformation("User '{UserName}' is fetching their tasks.", currentUser.UserName);
            }

    // Execute the final query
    var todoItems = await query.ToListAsync();
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

        // Add this method inside the TodoController class

        // DELETE: api/todo/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Find the task by its ID
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound(); // Task doesn't exist
            }

            // IMPORTANT: Security check - ensure the task belongs to the logged-in user
            if (todoItem.UserId != userId)
            {
                return Forbid(); // User is not authorized to delete this task
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent(); // Standard response for a successful delete
        }



// Add this method inside the TodoController class

// PUT: api/todo/{id}
[HttpPut("{id}")]
public async Task<IActionResult> UpdateTodoItem(int id, [FromBody] TodoItemDto todoItemDto)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    // Find the existing task
    var todoItem = await _context.TodoItems.FindAsync(id);

    if (todoItem == null)
    {
        return NotFound();
    }

    // Security check: Ensure the task belongs to the logged-in user
    if (todoItem.UserId != userId)
    {
        return Forbid();
    }

    // Update the properties of the existing task
    todoItem.Title = todoItemDto.Title;
    todoItem.Description = todoItemDto.Description;
    todoItem.DueDate = todoItemDto.DueDate;
    todoItem.Priority = todoItemDto.Priority;
    todoItem.Status = todoItemDto.Status;

    // Mark the entity as modified and save changes
    _context.Entry(todoItem).State = EntityState.Modified;
    await _context.SaveChangesAsync();

    return NoContent(); // Standard response for a successful update
}

    }
    
    
}