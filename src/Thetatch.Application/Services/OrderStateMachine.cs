using Thetatch.Domain.Enums;

namespace Thetatch.Application.Services;

public static class OrderStateMachine
{
    public static bool CanCancel(OrderStatus status) =>
        status is not OrderStatus.Shipped
            and not OrderStatus.Delivered
            and not OrderStatus.Cancelled;

    public static bool IsValidTransition(OrderStatus from, OrderStatus to, PaymentMethod paymentMethod)
    {
        if (to == OrderStatus.Cancelled)
        {
            return CanCancel(from);
        }

        return (from, to) switch
        {
            (OrderStatus.Pending, OrderStatus.Contacted) => true,
            (OrderStatus.Contacted, OrderStatus.Confirmed) => true,
            (OrderStatus.Confirmed, OrderStatus.Processing) => paymentMethod == PaymentMethod.CashOnDelivery,
            (OrderStatus.Confirmed, OrderStatus.Paid) => paymentMethod != PaymentMethod.CashOnDelivery,
            (OrderStatus.Paid, OrderStatus.Processing) => paymentMethod != PaymentMethod.CashOnDelivery,
            (OrderStatus.Processing, OrderStatus.Shipped) => true,
            (OrderStatus.Shipped, OrderStatus.Delivered) => true,
            _ => false
        };
    }
}
