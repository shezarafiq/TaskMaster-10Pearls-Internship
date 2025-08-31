using System.Security.Claims;
using backend.Data;
using backend.DTOs.Admin;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; 

namespace backend.Controllers
{
    [Authorize(Roles = "Admin")] 
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AdminController> _logger; 

    public AdminController(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext context,
        RoleManager<IdentityRole> roleManager,
        ILogger<AdminController> logger) 
    {
        _userManager = userManager;
        _context = context;
        _roleManager = roleManager;
        _logger = logger;
    }
        
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var adminUserName = User.FindFirstValue(ClaimTypes.Name);
            _logger.LogInformation("Admin '{AdminUserName}' fetched the list of all users.", adminUserName);
            
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Roles = await _userManager.GetRolesAsync(user),
                    IsActive = user.IsActive,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Gender = user.Gender

                });
            }

            return Ok(userDtos);
        }


        [HttpPut("assign-task/{taskId}")]
        public async Task<IActionResult> AssignTask(int taskId, [FromBody] AssignTaskDto assignTaskDto)
        {
            var task = await _context.TodoItems.FindAsync(taskId);
            if (task == null)
            {
                return NotFound($"Task with ID {taskId} not found.");
            }

            var user = await _userManager.FindByIdAsync(assignTaskDto.NewUserId);
            if (user == null)
            {
                return NotFound($"User with ID {assignTaskDto.NewUserId} not found.");
            }

            task.UserId = assignTaskDto.NewUserId;
            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Task {taskId} successfully assigned to user {user.UserName}." });
        }


        [HttpPut("set-status/{userId}")]
        public async Task<IActionResult> SetUserStatus(string userId, [FromBody] SetUserStatusDto statusDto)
        {

            
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            var currentAdminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (user.Id == currentAdminId)
            {
                return BadRequest("Admin cannot change their own status.");
            }

            user.IsActive = statusDto.IsActive;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = $"User {user.UserName}'s status has been updated." });
            }

            return BadRequest("Failed to update user status.");
        }


        [HttpPost("add-role")]
        public async Task<IActionResult> AddRoleToUser([FromBody] UpdateUserRoleDto roleDto)
        {
            var user = await _userManager.FindByIdAsync(roleDto.UserId);
            if (user == null)
            {
                return NotFound($"User with ID {roleDto.UserId} not found.");
            }

            if (!await _roleManager.RoleExistsAsync(roleDto.RoleName))
            {
                return NotFound($"Role '{roleDto.RoleName}' not found.");
            }

            var result = await _userManager.AddToRoleAsync(user, roleDto.RoleName);

            if (result.Succeeded)
            {
                return Ok(new { message = $"Role '{roleDto.RoleName}' successfully added to user {user.UserName}." });
            }

            return BadRequest(result.Errors);
        }

      

        [HttpPost("remove-role")]
        public async Task<IActionResult> RemoveRoleFromUser([FromBody] UpdateUserRoleDto roleDto)
        {
            var user = await _userManager.FindByIdAsync(roleDto.UserId);
            if (user == null)
                return NotFound($"User with ID {roleDto.UserId} not found.");

            if (!await _roleManager.RoleExistsAsync(roleDto.RoleName))
                return NotFound($"Role '{roleDto.RoleName}' not found.");

            var currentAdminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (user.Id == currentAdminId && roleDto.RoleName == "Admin")
            {
                return BadRequest(new { message = "You cannot remove the Admin role from your own account." });
            }

            if (roleDto.RoleName == "Admin")
            {
                var admins = await _userManager.GetUsersInRoleAsync("Admin");
                if (admins.Count == 1 && admins.First().Id == user.Id)
                {
                    return BadRequest(new { message = "Cannot remove the role from the last Admin in the system." });
                }
            }

            var result = await _userManager.RemoveFromRoleAsync(user, roleDto.RoleName);

            if (result.Succeeded)
            {
                return Ok(new { message = $"Role '{roleDto.RoleName}' successfully removed from user {user.UserName}." });
            }

            return BadRequest(result.Errors);
        }
    }
}