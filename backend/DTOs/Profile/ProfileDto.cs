// File: backend/DTOs/Profile/ProfileDto.cs

// The namespace MUST match the folder structure: backend -> DTOs -> Profile
namespace backend.DTOs.Profile
{
    public class ProfileDto
    {
        // These need to be nullable or have initializers to avoid build warnings
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public IList<string>? Roles { get; set; }

        public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }
    }
}