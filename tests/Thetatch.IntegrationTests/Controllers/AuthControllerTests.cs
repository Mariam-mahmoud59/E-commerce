using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Thetatch.Application.DTOs.Auth;

namespace Thetatch.IntegrationTests.Controllers;

[Collection("Integration")]
public class AuthControllerTests
{
    private readonly HttpClient _client;

    public AuthControllerTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            HandleCookies = false
        });
    }

    [Fact]
    public async Task Register_WithValidPayload_ReturnsOk()
    {
        var request = new RegisterRequest
        {
            FullName = "Integration User",
            Email = $"integration-{Guid.NewGuid():N}@example.com",
            Phone = "1234567890",
            Password = "Pass@1234",
            PreferredLanguage = "en"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsAccessTokenAndRefreshCookie()
    {
        var email = $"login-{Guid.NewGuid():N}@example.com";
        await RegisterUserAsync(email, "Pass@1234");

        var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = email,
            Password = "Pass@1234"
        });

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<AuthResponse>();
        var refreshCookie = ExtractRefreshCookie(response);

        Assert.NotNull(body);
        Assert.False(string.IsNullOrWhiteSpace(body!.Token));
        Assert.Contains("Customer", body.Roles);
        Assert.False(string.IsNullOrWhiteSpace(refreshCookie));
    }

    [Fact]
    public async Task Refresh_WithValidCookie_RotatesRefreshToken()
    {
        var email = $"refresh-{Guid.NewGuid():N}@example.com";
        await RegisterUserAsync(email, "Pass@1234");

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = email,
            Password = "Pass@1234"
        });
        loginResponse.EnsureSuccessStatusCode();
        var oldCookie = ExtractRefreshCookie(loginResponse);

        using var refreshRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        refreshRequest.Headers.Add("Cookie", oldCookie);
        var refreshResponse = await _client.SendAsync(refreshRequest);
        refreshResponse.EnsureSuccessStatusCode();

        var refreshBody = await refreshResponse.Content.ReadFromJsonAsync<AuthResponse>();
        var newCookie = ExtractRefreshCookie(refreshResponse);

        Assert.NotNull(refreshBody);
        Assert.False(string.IsNullOrWhiteSpace(refreshBody!.Token));
        Assert.NotEqual(oldCookie, newCookie);
    }

    [Fact]
    public async Task AdminEndpoint_WithCustomerToken_ReturnsForbidden()
    {
        var email = $"customer-{Guid.NewGuid():N}@example.com";
        await RegisterUserAsync(email, "Pass@1234");
        var customerToken = await LoginAndGetAccessTokenAsync(email, "Pass@1234");

        var response = await SendAuthorizedGetAsync("/api/adminorders", customerToken);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_WithAdminToken_ReturnsOk()
    {
        var adminToken = await LoginAndGetAccessTokenAsync("admin@horizons.com", "Admin@123");

        var response = await SendAuthorizedGetAsync("/api/adminorders", adminToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private async Task RegisterUserAsync(string email, string password)
    {
        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest
        {
            FullName = "Test Customer",
            Email = email,
            Phone = "1234567890",
            Password = password,
            PreferredLanguage = "en"
        });

        registerResponse.EnsureSuccessStatusCode();
    }

    private async Task<string> LoginAndGetAccessTokenAsync(string email, string password)
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = email,
            Password = password
        });

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<AuthResponse>();
        return body?.Token ?? string.Empty;
    }

    private async Task<HttpResponseMessage> SendAuthorizedGetAsync(string url, string accessToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        return await _client.SendAsync(request);
    }

    private static string ExtractRefreshCookie(HttpResponseMessage response)
    {
        var setCookieHeader = response.Headers.TryGetValues("Set-Cookie", out var values)
            ? values.FirstOrDefault(v => v.StartsWith("refreshToken=", StringComparison.OrdinalIgnoreCase))
            : null;

        if (string.IsNullOrWhiteSpace(setCookieHeader))
        {
            return string.Empty;
        }

        return setCookieHeader.Split(';')[0];
    }
}
