using Thetatch.Domain.Common;
using Thetatch.Domain.Enums;
using System.Text.Json;

namespace Thetatch.Domain.Entities;

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public JsonDocument ShippingAddressSnapshot { get; set; } = null!;
    
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentMethod PaymentMethod { get; set; }
    
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal TotalAmount { get; set; }
    
    public Guid? DiscountId { get; set; }
    public string CurrencyCode { get; set; } = "EGP";
    
    public string? TrackingNumber { get; set; }
    public string? ShippingCarrier { get; set; }
    public string? Notes { get; set; }
    
    public string IdempotencyKey { get; set; } = string.Empty;
    public bool StockDecremented { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
}
