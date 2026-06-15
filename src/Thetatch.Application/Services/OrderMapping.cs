using System.Text.Json;
using Thetatch.Application.DTOs.Orders;
using Thetatch.Domain.Entities;

namespace Thetatch.Application.Services;

public static class OrderMapping
{
    public static OrderResponse ToResponse(Order order)
    {
        var address = JsonSerializer.Deserialize<ShippingAddressDto>(
            order.ShippingAddressSnapshot.RootElement.GetRawText())
            ?? new ShippingAddressDto();

        return new OrderResponse
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            CustomerName = order.CustomerName,
            CustomerPhone = order.CustomerPhone,
            ShippingAddress = address,
            SubTotal = order.SubTotal,
            DiscountAmount = order.DiscountAmount,
            ShippingCost = order.ShippingCost,
            TotalAmount = order.TotalAmount,
            CurrencyCode = order.CurrencyCode,
            Notes = order.Notes,
            TrackingNumber = order.TrackingNumber,
            ShippingCarrier = order.ShippingCarrier,
            StockDecremented = order.StockDecremented,
            CreatedAt = order.CreatedAt,
            Items = order.Items.Select(i => new OrderItemResponse
            {
                Id = i.Id,
                ProductVariantId = i.ProductVariantId,
                ProductName = i.ProductName,
                SKU = i.SKU,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                TotalPrice = i.TotalPrice
            }).ToList()
        };
    }

    public static OrderSummaryResponse ToSummary(Order order) =>
        new()
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            TotalAmount = order.TotalAmount,
            CurrencyCode = order.CurrencyCode,
            CreatedAt = order.CreatedAt,
            ItemCount = order.Items.Count
        };
}
