// File: backend/Controllers/AdminController.cs
using System.Security.Claims;
using backend.Data;
using backend.DTOs.Admin;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Authorize(Roles = "Admin")] // 1. CRITICAL: Only Admins can access this controller
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context; // ADD THIS

        private readonly RoleManager<IdentityRole> _roleManager; // <-- THE FIX: DECLARE THE FIELD HERE



        public AdminController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _context = context; // ADD THIS
            _roleManager = roleManager; // Now this line will work correctly


        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
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
            // 1. Find the task
            var task = await _context.TodoItems.FindAsync(taskId);
            if (task == null)
            {
                return NotFound($"Task with ID {taskId} not found.");
            }

            // 2. Find the user to assign the task to
            var user = await _userManager.FindByIdAsync(assignTaskDto.NewUserId);
            if (user == null)
            {
                return NotFound($"User with ID {assignTaskDto.NewUserId} not found.");
            }

            // 3. Re-assign the UserId and save
            task.UserId = assignTaskDto.NewUserId;
            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Task {taskId} successfully assigned to user {user.UserName}." });
        }

        // Add this method inside AdminController.cs

        // PUT: api/admin/set-status/{userId}
        [HttpPut("set-status/{userId}")]
        public async Task<IActionResult> SetUserStatus(string userId, [FromBody] SetUserStatusDto statusDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            // Prevent an admin from deactivating themselves
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

        // Add this method inside AdminController.cs

        // POST: api/admin/add-role
        [HttpPost("add-role")]
        public async Task<IActionResult> AddRoleToUser([FromBody] UpdateUserRoleDto roleDto)
        {
            // 1. Check if the user exists
            var user = await _userManager.FindByIdAsync(roleDto.UserId);
            if (user == null)
            {
                return NotFound($"User with ID {roleDto.UserId} not found.");
            }

            // 2. Check if the role exists
            if (!await _roleManager.RoleExistsAsync(roleDto.RoleName))
            {
                return NotFound($"Role '{roleDto.RoleName}' not found.");
            }

            // 3. Add the user to the role
            var result = await _userManager.AddToRoleAsync(user, roleDto.RoleName);

            if (result.Succeeded)
            {
                return Ok(new { message = $"Role '{roleDto.RoleName}' successfully added to user {user.UserName}." });
            }

            // If it failed, return the errors
            return BadRequest(result.Errors);
        }

        // Add this method inside AdminController.cs

        // POST: api/admin/remove-role
        // [HttpPost("remove-role")]
        // public async Task<IActionResult> RemoveRoleFromUser([FromBody] UpdateUserRoleDto roleDto)
        // {
        //     // 1. Check if the user exists
        //     var user = await _userManager.FindByIdAsync(roleDto.UserId);
        //     if (user == null)
        //     {
        //         return NotFound($"User with ID {roleDto.UserId} not found.");
        //     }

        //     // 2. Check if the role exists
        //     if (!await _roleManager.RoleExistsAsync(roleDto.RoleName))
        //     {
        //         return NotFound($"Role '{roleDto.RoleName}' not found.");
        //     }

        //     // You might want to add a check here to prevent removing the last admin role from the system

        //     // 3. Remove the user from the role
        //     var result = await _userManager.RemoveFromRoleAsync(user, roleDto.RoleName);

        //     if (result.Succeeded)
        //     {
        //         return Ok(new { message = $"Role '{roleDto.RoleName}' successfully removed from user {user.UserName}." });
        //     }

        //     // If it failed, return the errors
        //     return BadRequest(result.Errors);
        // }
        //         // We will add more endpoints here later (e.g., assign task, change status)
        //     }
        // File: backend/Controllers/AdminController.cs

        [HttpPost("remove-role")]
        public async Task<IActionResult> RemoveRoleFromUser([FromBody] UpdateUserRoleDto roleDto)
        {
            var user = await _userManager.FindByIdAsync(roleDto.UserId);
            if (user == null)
                return NotFound($"User with ID {roleDto.UserId} not found.");

            if (!await _roleManager.RoleExistsAsync(roleDto.RoleName))
                return NotFound($"Role '{roleDto.RoleName}' not found.");

            // Safeguard 1: Prevent admin from removing their own Admin role
            var currentAdminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (user.Id == currentAdminId && roleDto.RoleName == "Admin")
            {
                return BadRequest(new { message = "You cannot remove the Admin role from your own account." });
            }

            // Safeguard 2: Prevent removal of the last Admin user's Admin role
            if (roleDto.RoleName == "Admin")
            {
                var admins = await _userManager.GetUsersInRoleAsync("Admin");
                // If there is only one admin left, AND the user we are trying to demote is that last admin...
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