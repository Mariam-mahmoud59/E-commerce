using Microsoft.AspNetCore.Identity;

namespace Thetatch.Domain.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = "en";
    
    // IdentityUser already has PhoneNumber, Email, UserName, PasswordHash, etc.
}
