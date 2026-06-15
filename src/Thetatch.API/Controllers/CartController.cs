using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Thetatch.Application.DTOs.Cart;
using Thetatch.Application.Interfaces;
using Thetatch.Domain.Entities;

namespace Thetatch.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentLanguageService _languageService;

    public CartController(IApplicationDbContext context, ICurrentLanguageService languageService)
    {
        _context = context;
        _languageService = languageService;
    }

    [HttpGet]
    public async Task<ActionResult<CartResponse>> GetCart()
    {
        var customerId = GetCustomerId();
        var cart = await GetOrCreateCartAsync(customerId);
        return Ok(MapCart(cart));
    }

    [HttpPost("items")]
    public async Task<ActionResult<CartResponse>> AddItem([FromBody] AddCartItemRequest request)
    {
        var customerId = GetCustomerId();
        var variant = await _context.ProductVariants
            .Include(v => v.Product)
            .FirstOrDefaultAsync(v => v.Id == request.ProductVariantId && v.IsActive);

        if (variant == null)
        {
            return NotFound("Product variant not found");
        }

        if (variant.StockQuantity < request.Quantity)
        {
            return BadRequest("Insufficient stock");
        }

        var cart = await GetOrCreateCartAsync(customerId);
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(i => i.CartId == cart.Id && i.ProductVariantId == request.ProductVariantId);

        if (existingItem != null)
        {
            var newQuantity = existingItem.Quantity + request.Quantity;
            if (variant.StockQuantity < newQuantity)
            {
                return BadRequest("Insufficient stock");
            }

            existingItem.Quantity = newQuantity;
            existingItem.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            _context.CartItems.Add(new CartItem
            {
                CartId = cart.Id,
                ProductVariantId = variant.Id,
                Quantity = request.Quantity
            });
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        cart = await LoadCartAsync(cart.Id);
        return Ok(MapCart(cart));
    }

    [HttpPut("items/{variantId:guid}")]
    public async Task<ActionResult<CartResponse>> UpdateItem(Guid variantId, [FromBody] UpdateCartItemRequest request)
    {
        var customerId = GetCustomerId();
        var cart = await GetOrCreateCartAsync(customerId);
        var item = await _context.CartItems
            .FirstOrDefaultAsync(i => i.CartId == cart.Id && i.ProductVariantId == variantId);

        if (item == null)
        {
            return NotFound("Cart item not found");
        }

        var variant = await _context.ProductVariants.FindAsync(variantId);
        if (variant == null || !variant.IsActive)
        {
            return NotFound("Product variant not found");
        }

        if (variant.StockQuantity < request.Quantity)
        {
            return BadRequest("Insufficient stock");
        }

        item.Quantity = request.Quantity;
        item.UpdatedAt = DateTime.UtcNow;
        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        cart = await LoadCartAsync(cart.Id);
        return Ok(MapCart(cart));
    }

    [HttpDelete("items/{variantId:guid}")]
    public async Task<ActionResult<CartResponse>> RemoveItem(Guid variantId)
    {
        var customerId = GetCustomerId();
        var cart = await GetOrCreateCartAsync(customerId);
        var item = await _context.CartItems
            .FirstOrDefaultAsync(i => i.CartId == cart.Id && i.ProductVariantId == variantId);

        if (item == null)
        {
            return NotFound("Cart item not found");
        }

        _context.CartItems.Remove(item);
        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        cart = await LoadCartAsync(cart.Id);
        return Ok(MapCart(cart));
    }

    private Guid GetCustomerId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private async Task<Cart> GetOrCreateCartAsync(Guid customerId)
    {
        var cart = await _context.Carts
            .FirstOrDefaultAsync(c => c.CustomerId == customerId);

        if (cart != null)
        {
            return await LoadCartAsync(cart.Id);
        }

        cart = new Cart { CustomerId = customerId };
        _context.Carts.Add(cart);
        await _context.SaveChangesAsync();

        return await LoadCartAsync(cart.Id);
    }

    private async Task<Cart> LoadCartAsync(Guid cartId) =>
        await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.ProductVariant)
            .ThenInclude(v => v.Product)
            .FirstAsync(c => c.Id == cartId);

    private CartResponse MapCart(Cart cart)
    {
        var language = _languageService.Language;
        var items = cart.Items.Select(i =>
        {
            var unitPrice = i.ProductVariant.PriceOverride ?? i.ProductVariant.Product.BasePrice;
            return new CartItemResponse
            {
                Id = i.Id,
                ProductVariantId = i.ProductVariantId,
                ProductName = i.ProductVariant.Product.Name.GetTranslation(language),
                SKU = i.ProductVariant.SKU,
                UnitPrice = unitPrice,
                Quantity = i.Quantity,
                LineTotal = unitPrice * i.Quantity
            };
        }).ToList();

        return new CartResponse
        {
            Id = cart.Id,
            Items = items,
            SubTotal = items.Sum(i => i.LineTotal),
            ItemCount = items.Sum(i => i.Quantity)
        };
    }
}
