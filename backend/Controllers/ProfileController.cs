
using backend.DTOs.Profile;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using backend.Data; 

namespace backend.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        

        private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<ProfileController> _logger;
    private readonly ApplicationDbContext _context;

    public ProfileController(
        UserManager<ApplicationUser> userManager, 
        ILogger<ProfileController> logger, 
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _logger = logger;
        _context = context;
    }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (user == null)
            {
                return NotFound("User not found.");
            }


            _logger.LogInformation("User '{UserName}' fetched their profile information.", user.UserName);
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