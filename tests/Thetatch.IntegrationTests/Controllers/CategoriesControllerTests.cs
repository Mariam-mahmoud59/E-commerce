using System.Net.Http.Json;
using Thetatch.Application.DTOs.Categories;

namespace Thetatch.IntegrationTests.Controllers;

[Collection("Integration")]
public class CategoriesControllerTests
{
    private readonly HttpClient _client;

    public CategoriesControllerTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCategories_WithEnglishLanguage_ReturnsEnglishText()
    {
        // Arrange
        _client.DefaultRequestHeaders.AcceptLanguage.Clear();
        _client.DefaultRequestHeaders.AcceptLanguage.ParseAdd("en");

        // Act
        var response = await _client.GetAsync("/api/v1/categories");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var categories = await response.Content.ReadFromJsonAsync<List<CategoryResponse>>();
        
        Assert.NotNull(categories);
        Assert.NotEmpty(categories);
        Assert.Contains(categories, c => c.Name == "Electronics" || c.Name == "Clothing");
    }

    [Fact]
    public async Task GetCategories_WithArabicLanguage_ReturnsArabicText()
    {
        // Arrange
        _client.DefaultRequestHeaders.AcceptLanguage.Clear();
        _client.DefaultRequestHeaders.AcceptLanguage.ParseAdd("ar");

        // Act
        var response = await _client.GetAsync("/api/v1/categories");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var categories = await response.Content.ReadFromJsonAsync<List<CategoryResponse>>();
        
        Assert.NotNull(categories);
        Assert.NotEmpty(categories);
        Assert.Contains(categories, c => c.Name == "إلكترونيات" || c.Name == "ملابس");
    }
}
