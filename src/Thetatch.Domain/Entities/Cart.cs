using Thetatch.Domain.Common;

namespace Thetatch.Domain.Entities;

public class Cart : BaseEntity
{
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
