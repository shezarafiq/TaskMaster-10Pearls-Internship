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
    private readonly ILogger<TodoController> _logger; 

    public TodoController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<TodoController> logger) 
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

      
    [HttpGet]
public async Task<IActionResult> GetTodoItems()
{
    var currentUser = await _userManager.GetUserAsync(User);
    if (currentUser == null)
    {
        return Unauthorized();
    }

    var userRoles = await _userManager.GetRolesAsync(currentUser);

    var isAdmin = userRoles.Contains("Admin");

    IQueryable<TodoItem> query = _context.TodoItems;

            if (isAdmin)
            {
               
                query = query.Include(item => item.User);
                _logger.LogInformation("Admin '{UserName}' is fetching all tasks.", currentUser.UserName);
            }
            else
            {
                query = query.Where(item => item.UserId == currentUser.Id);
                _logger.LogInformation("User '{UserName}' is fetching their tasks.", currentUser.UserName);
            }

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


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            if (todoItem.UserId != userId)
            {
                return Forbid(); 
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }




[HttpPut("{id}")]
public async Task<IActionResult> UpdateTodoItem(int id, [FromBody] TodoItemDto todoItemDto)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    var todoItem = await _context.TodoItems.FindAsync(id);

    if (todoItem == null)
    {
        return NotFound();
    }

    if (todoItem.UserId != userId)
    {
        return Forbid();
    }

    todoItem.Title = todoItemDto.Title;
    todoItem.Description = todoItemDto.Description;
    todoItem.DueDate = todoItemDto.DueDate;
    todoItem.Priority = todoItemDto.Priority;
    todoItem.Status = todoItemDto.Status;

    _context.Entry(todoItem).State = EntityState.Modified;
    await _context.SaveChangesAsync();

    return NoContent(); 
}

    }
    
    
}