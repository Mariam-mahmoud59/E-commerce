using Thetatch.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Thetatch.Application.DTOs.Products;

public class CreateProductRequest
{
    [Required]
    public string NameEn { get; set; } = string.Empty;
    
    [Required]
    public string NameAr { get; set; } = string.Empty;
    
    [Required]
    public string DescriptionEn { get; set; } = string.Empty;
    
    [Required]
    public string DescriptionAr { get; set; } = string.Empty;
    
    public decimal BasePrice { get; set; }
    public decimal? CompareAtPrice { get; set; }
    
    public Guid CategoryId { get; set; }
    
    public ProductStatus Status { get; set; } = ProductStatus.Active;
}
