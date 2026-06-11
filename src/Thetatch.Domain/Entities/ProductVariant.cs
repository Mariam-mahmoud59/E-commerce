using Thetatch.Domain.Common;

namespace Thetatch.Domain.Entities;

public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string SKU { get; set; } = string.Empty;
    public string? Size { get; set; }
    public string? Color { get; set; }

    public decimal? PriceOverride { get; set; }
    public int StockQuantity { get; set; }
    public int LowStockThreshold { get; set; } = 5;
    public decimal WeightInKg { get; set; }

    public bool IsActive { get; set; } = true;
}
