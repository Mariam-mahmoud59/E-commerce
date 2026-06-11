using Thetatch.Domain.Common;
using Thetatch.Domain.Enums;
using System.Text.Json;

namespace Thetatch.Domain.Entities;

public class Product : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    
    public LocalizedText Name { get; set; } = new();
    public LocalizedText Description { get; set; } = new();
    
    public decimal BasePrice { get; set; }
    public decimal? CompareAtPrice { get; set; }
    
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    // Flexible key-value store for specifications, stored as JSONB
    public JsonDocument? Metadata { get; set; }
    
    public List<string> Tags { get; set; } = new();
    
    public ProductStatus Status { get; set; } = ProductStatus.Draft;
    
    public LocalizedText SeoTitle { get; set; } = new();
    public LocalizedText SeoDescription { get; set; } = new();

    public bool IsDeleted { get; set; }

    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}
