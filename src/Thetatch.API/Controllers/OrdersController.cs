using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Thetatch.Application.DTOs.Orders;
using Thetatch.Application.Interfaces;
using Thetatch.Application.Services;
using Thetatch.SharedKernel.Exceptions;

namespace Thetatch.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly OrderWorkflowService _orderWorkflow;

    public OrdersController(IApplicationDbContext context, OrderWorkflowService orderWorkflow)
    {
        _context = context;
        _orderWorkflow = orderWorkflow;
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> CreateOrder(
        [FromBody] CreateOrderRequest request,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey)
    {
        try
        {
            var order = await _orderWorkflow.CreateOrderFromCartAsync(
                GetCustomerId(),
                request,
                idempotencyKey ?? string.Empty);

            order = await LoadOrderAsync(order.Id);
            if (order == null)
            {
                return NotFound();
            }

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, OrderMapping.ToResponse(order));
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderSummaryResponse>>> GetOrders()
    {
        var customerId = GetCustomerId();
        var orders = await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(OrderMapping.ToSummary).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OrderResponse>> GetOrder(Guid id)
    {
        var customerId = GetCustomerId();
        var order = await LoadOrderAsync(id);

        if (order == null || order.CustomerId != customerId)
        {
            return NotFound();
        }

        return Ok(OrderMapping.ToResponse(order));
    }

    private Guid GetCustomerId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private async Task<Domain.Entities.Order?> LoadOrderAsync(Guid id) =>
        await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);
}
