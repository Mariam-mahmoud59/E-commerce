using Thetatch.Domain.Common;
using Thetatch.Domain.Enums;

namespace Thetatch.Domain.Entities;

public class OrderStatusHistory : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    
    public OrderStatus OldStatus { get; set; }
    public OrderStatus NewStatus { get; set; }
    
    public Guid ChangedByUserId { get; set; }
    public ApplicationUser ChangedByUser { get; set; } = null!;
    
    public string? Notes { get; set; }
}
