using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Thetatch.Application.DTOs.Orders;
using Thetatch.Application.Interfaces;
using Thetatch.Domain.Entities;
using Thetatch.Domain.Enums;
using Thetatch.SharedKernel.Exceptions;

namespace Thetatch.Application.Services;

public class OrderWorkflowService
{
    private readonly IApplicationDbContext _context;

    public OrderWorkflowService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Order> CreateOrderFromCartAsync(
        Guid customerId,
        CreateOrderRequest request,
        string idempotencyKey,
        CancellationToken cancellationToken = default)
    {
        if (!string.IsNullOrWhiteSpace(idempotencyKey))
        {
            var existing = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(
                    o => o.CustomerId == customerId && o.IdempotencyKey == idempotencyKey,
                    cancellationToken);

            if (existing != null)
            {
                return existing;
            }
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.ProductVariant)
            .ThenInclude(v => v.Product)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId, cancellationToken);

        if (cart == null || cart.Items.Count == 0)
        {
            throw new DomainException("Cart is empty");
        }

        var orderItems = new List<OrderItem>();
        decimal subTotal = 0;

        foreach (var cartItem in cart.Items)
        {
            var variant = cartItem.ProductVariant;
            if (!variant.IsActive)
            {
                throw new DomainException($"Product variant {variant.SKU} is not available");
            }

            if (variant.StockQuantity < cartItem.Quantity)
            {
                throw new DomainException($"Insufficient stock for {variant.SKU}");
            }

            var unitPrice = variant.PriceOverride ?? variant.Product.BasePrice;
            var lineTotal = unitPrice * cartItem.Quantity;
            subTotal += lineTotal;

            orderItems.Add(new OrderItem
            {
                ProductVariantId = variant.Id,
                ProductName = variant.Product.Name.En,
                SKU = variant.SKU,
                UnitPrice = unitPrice,
                Quantity = cartItem.Quantity,
                TotalPrice = lineTotal
            });
        }

        var order = new Order
        {
            OrderNumber = await GenerateOrderNumberAsync(cancellationToken),
            CustomerId = customerId,
            CustomerName = request.CustomerName,
            CustomerPhone = request.CustomerPhone,
            ShippingAddressSnapshot = JsonSerializer.SerializeToDocument(request.ShippingAddress),
            Status = OrderStatus.Pending,
            PaymentMethod = request.PaymentMethod,
            SubTotal = subTotal,
            DiscountAmount = 0,
            ShippingCost = request.ShippingCost,
            TotalAmount = subTotal + request.ShippingCost,
            IdempotencyKey = string.IsNullOrWhiteSpace(idempotencyKey)
                ? Guid.NewGuid().ToString("N")
                : idempotencyKey,
            Items = orderItems
        };

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cart.Items);

        await _context.SaveChangesAsync(cancellationToken);
        return order;
    }

    public async Task<Order> ApplyStatusChangeAsync(
        Guid orderId,
        OrderStatus newStatus,
        Guid changedByUserId,
        string? notes = null,
        CancellationToken cancellationToken = default)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order == null)
        {
            throw new DomainException("Order not found");
        }

        var oldStatus = order.Status;

        if (!OrderStateMachine.IsValidTransition(oldStatus, newStatus, order.PaymentMethod))
        {
            throw new DomainException($"Invalid status transition from {oldStatus} to {newStatus}");
        }

        if ((newStatus == OrderStatus.Processing || newStatus == OrderStatus.Paid) && !order.StockDecremented)
        {
            await DecrementStockAsync(order, cancellationToken);
            order.StockDecremented = true;
        }

        if (newStatus == OrderStatus.Cancelled && order.StockDecremented)
        {
            await RestockAsync(order, cancellationToken);
            order.StockDecremented = false;
        }

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        _context.OrderStatusHistories.Add(new OrderStatusHistory
        {
            OrderId = order.Id,
            OldStatus = oldStatus,
            NewStatus = newStatus,
            ChangedByUserId = changedByUserId,
            Notes = notes
        });

        await _context.SaveChangesAsync(cancellationToken);
        return order;
    }

    private async Task DecrementStockAsync(Order order, CancellationToken cancellationToken)
    {
        foreach (var item in order.Items)
        {
            var variant = await _context.ProductVariants
                .FirstOrDefaultAsync(v => v.Id == item.ProductVariantId, cancellationToken);

            if (variant == null)
            {
                throw new DomainException($"Product variant not found for SKU {item.SKU}");
            }

            if (variant.StockQuantity < item.Quantity)
            {
                throw new DomainException($"Insufficient stock for {item.SKU}");
            }

            variant.StockQuantity -= item.Quantity;
        }
    }

    private async Task RestockAsync(Order order, CancellationToken cancellationToken)
    {
        foreach (var item in order.Items)
        {
            var variant = await _context.ProductVariants
                .FirstOrDefaultAsync(v => v.Id == item.ProductVariantId, cancellationToken);

            if (variant != null)
            {
                variant.StockQuantity += item.Quantity;
            }
        }
    }

    private async Task<string> GenerateOrderNumberAsync(CancellationToken cancellationToken)
    {
        var count = await _context.Orders.CountAsync(cancellationToken);
        return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D5}";
    }
}
