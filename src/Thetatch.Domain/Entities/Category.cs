using Thetatch.Domain.Common;

namespace Thetatch.Domain.Entities;

public class Category : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    public LocalizedText Name { get; set; } = new();
    public LocalizedText Description { get; set; } = new();
    
    public Guid? ParentCategoryId { get; set; }
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();
    
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
