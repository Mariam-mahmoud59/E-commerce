using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Thetatch.Application.Interfaces;
using Thetatch.Domain.Enums;

namespace Thetatch.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminOrdersController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public AdminOrdersController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
            
        return Ok(orders);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult> GetOrder(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == id);
            
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();
        
        order.Status = request.Status;
        
        await _context.SaveChangesAsync();
        return Ok(order);
    }
}

public class UpdateOrderStatusRequest
{
    public OrderStatus Status { get; set; }
}
