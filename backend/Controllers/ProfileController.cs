// File: backend/Controllers/ProfileController.cs

using backend.DTOs.Profile;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize] // Requires user to be logged in
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/profile/me
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            // Find the user based on the ID from their token
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (user == null)
            {
                return NotFound("User not found.");
            }


            var roles = await _userManager.GetRolesAsync(user);

            var profileDto = new ProfileDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Roles = roles,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Gender = user.Gender
            };

            return Ok(profileDto);
        }
    }
}