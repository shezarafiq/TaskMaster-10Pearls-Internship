// File: backend/DTOs/Admin/UserDto.cs

// The namespace MUST match the folder structure: backend -> DTOs -> Admin
namespace backend.DTOs.Admin
{
    public class UserDto
    {
        public string? Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public IList<string>? Roles { get; set; }

        public bool IsActive { get; set; }

        public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }

    }
}