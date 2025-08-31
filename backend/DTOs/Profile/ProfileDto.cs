

namespace backend.DTOs.Profile
{
    public class ProfileDto
    {
   
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public IList<string>? Roles { get; set; }

        public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }
    }
}