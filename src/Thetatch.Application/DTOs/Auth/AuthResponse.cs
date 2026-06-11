namespace Thetatch.Application.DTOs.Auth;

public class AuthResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public IList<string> Roles { get; set; } = new List<string>();
    public string Token { get; set; } = string.Empty;
}
