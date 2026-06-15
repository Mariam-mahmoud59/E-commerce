namespace Thetatch.Application.DTOs.Cart;

public class AddCartItemRequest
{
    public Guid ProductVariantId { get; set; }
    public int Quantity { get; set; }
}
