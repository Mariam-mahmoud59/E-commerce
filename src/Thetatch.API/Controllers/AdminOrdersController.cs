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
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminOrdersController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly OrderWorkflowService _orderWorkflow;

    public AdminOrdersController(IApplicationDbContext context, OrderWorkflowService orderWorkflow)
    {
        _context = context;
        _orderWorkflow = orderWorkflow;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderResponse>>> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(OrderMapping.ToResponse).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OrderResponse>> GetOrder(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        return Ok(OrderMapping.ToResponse(order));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<OrderResponse>> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            var order = await _orderWorkflow.ApplyStatusChangeAsync(
                id,
                request.Status,
                GetAdminUserId());

            order = await _context.Orders
                .Include(o => o.Items)
                .FirstAsync(o => o.Id == order.Id);

            return Ok(OrderMapping.ToResponse(order));
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("{id:guid}/notes")]
    public async Task<ActionResult<OrderResponse>> UpdateOrderNotes(Guid id, [FromBody] UpdateOrderNotesRequest request)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        order.Notes = request.Notes;
        order.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(OrderMapping.ToResponse(order));
    }

    private Guid GetAdminUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
