using Thetatch.Domain.Enums;

namespace Thetatch.Application.DTOs.Orders;

public class OrderSummaryResponse
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public decimal TotalAmount { get; set; }
    public string CurrencyCode { get; set; } = "EGP";
    public DateTime CreatedAt { get; set; }
    public int ItemCount { get; set; }
}
