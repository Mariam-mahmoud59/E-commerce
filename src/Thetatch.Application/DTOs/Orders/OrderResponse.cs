using Thetatch.Domain.Enums;

namespace Thetatch.Application.DTOs.Orders;

public class OrderResponse
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public ShippingAddressDto ShippingAddress { get; set; } = new();
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal TotalAmount { get; set; }
    public string CurrencyCode { get; set; } = "EGP";
    public string? Notes { get; set; }
    public string? TrackingNumber { get; set; }
    public string? ShippingCarrier { get; set; }
    public bool StockDecremented { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemResponse> Items { get; set; } = new();
}
