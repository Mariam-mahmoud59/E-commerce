using Thetatch.Domain.Enums;

namespace Thetatch.Application.DTOs.Orders;

public class UpdateOrderStatusRequest
{
    public OrderStatus Status { get; set; }
}
