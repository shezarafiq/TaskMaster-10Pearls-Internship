using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using backend.DTOs.Auth; 
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging; // ADD THIS using statement


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
     private readonly ILogger<AuthController> _logger; // 1. Add a private field for the logger


        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger; // 3. Assign the logger

        }

        [HttpPost]
        [Route("login")]
        // Paste this entire method into AuthController.cs, replacing the old Login method.
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);

            // First, check if the user exists and is active.
            if (user != null && !user.IsActive)
            {
                return Unauthorized(new { message = "This user account has been deactivated." });
            }

            // Next, check if the password is correct.
            if (user != null && await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                // If credentials are valid, proceed to create the token.
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

                // Add all of the user's roles to the claims.
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var token = GetToken(authClaims);

                // 4. ADD THE LOG STATEMENT
                _logger.LogInformation("User '{UserName}' logged in successfully.", user.UserName);


                // Return the token upon successful login.
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });


            }
            _logger.LogWarning("Failed login attempt for user '{UserName}'.", loginDto.Username);
        return Unauthorized(new { message = "Invalid username or password." });


            // If username doesn't exist or password is incorrect, return Unauthorized.
            // return Unauthorized(new { message = "Invalid username or password." });
            
        }

        // public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        // {
        //     var user = await _userManager.FindByNameAsync(loginDto.Username);
        //     if (user != null && await _userManager.CheckPasswordAsync(user, loginDto.Password))
        //     {

        //         // var authClaims = new List<Claim>
        //         // {
        //         //     new Claim(ClaimTypes.Name, user.UserName),
        //         //     new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        //         //     new Claim(ClaimTypes.NameIdentifier, user.Id) // <-- THE FIX
        //         // };
        //         // Get the roles for the user
        //         var userRoles = await _userManager.GetRolesAsync(user);

        //         var authClaims = new List<Claim>
        //         {
        //             new Claim(ClaimTypes.Name, user.UserName),
        //             new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        //             new Claim(ClaimTypes.NameIdentifier, user.Id)
        //         };

        //         // Add all the role claims
        //         foreach (var userRole in userRoles)
        //         {
        //             authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        //         }
        //         var token = GetToken(authClaims);

        //         return Ok(new
        //         {
        //             token = new JwtSecurityTokenHandler().WriteToken(token),
        //             expiration = token.ValidTo
        //         });
        //     }
        //     return Unauthorized();
        // }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var userExists = await _userManager.FindByNameAsync(registerDto.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User already exists!" });

            ApplicationUser user = new()
            {
                Email = registerDto.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = registerDto.Username,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Gender = registerDto.Gender 
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            return Ok(new { Status = "Success", Message = "User created successfully!" });
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }
    }
}