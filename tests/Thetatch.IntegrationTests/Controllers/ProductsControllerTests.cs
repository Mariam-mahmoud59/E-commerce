using System.Net.Http.Json;
using Thetatch.Application.DTOs.Products;

namespace Thetatch.IntegrationTests.Controllers;

[Collection("Integration")]
public class ProductsControllerTests
{
    private readonly HttpClient _client;

    public ProductsControllerTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_WithEnglishLanguage_ReturnsEnglishText()
    {
        // Arrange
        _client.DefaultRequestHeaders.AcceptLanguage.Clear();
        _client.DefaultRequestHeaders.AcceptLanguage.ParseAdd("en");

        // Act
        var response = await _client.GetAsync("/api/v1/products");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<Thetatch.SharedKernel.PagedResult<ProductResponse>>();
        var products = result?.Items;
        
        Assert.NotNull(products);
        Assert.NotEmpty(products);
        Assert.Contains(products, p => p.Name.Contains("Laptop") || p.Name.Contains("Shirt") || p.Name.Contains("Smartphone"));
    }

    [Fact]
    public async Task GetProducts_WithArabicLanguage_ReturnsArabicText()
    {
        // Arrange
        _client.DefaultRequestHeaders.AcceptLanguage.Clear();
        _client.DefaultRequestHeaders.AcceptLanguage.ParseAdd("ar");

        // Act
        var response = await _client.GetAsync("/api/v1/products");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<Thetatch.SharedKernel.PagedResult<ProductResponse>>();
        var products = result?.Items;
        
        Assert.NotNull(products);
        Assert.NotEmpty(products);
        Assert.Contains(products, p => p.Name.Contains("ألعاب") || p.Name.Contains("قطني") || p.Name.Contains("ذكي"));
    }
}
