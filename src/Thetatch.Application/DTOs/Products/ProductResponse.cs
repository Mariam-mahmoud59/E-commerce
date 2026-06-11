namespace Thetatch.Application.DTOs.Products;

public class ProductResponse
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public string SeoTitle { get; set; } = string.Empty;
    public string SeoDescription { get; set; } = string.Empty;
    public List<ProductVariantResponse> Variants { get; set; } = new();
    public List<ProductImageResponse> Images { get; set; } = new();
}

public class ProductVariantResponse
{
    public Guid Id { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string? Size { get; set; }
    public string? Color { get; set; }
    public decimal? PriceOverride { get; set; }
    public int StockQuantity { get; set; }
}

public class ProductImageResponse
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}
