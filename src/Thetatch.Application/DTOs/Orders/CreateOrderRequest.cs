using Thetatch.Domain.Enums;

namespace Thetatch.Application.DTOs.Orders;

public class CreateOrderRequest
{
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public ShippingAddressDto ShippingAddress { get; set; } = new();
    public PaymentMethod PaymentMethod { get; set; }
    public decimal ShippingCost { get; set; }
}
