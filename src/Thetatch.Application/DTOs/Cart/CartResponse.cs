namespace Thetatch.Application.DTOs.Cart;

public class CartResponse
{
    public Guid Id { get; set; }
    public List<CartItemResponse> Items { get; set; } = new();
    public decimal SubTotal { get; set; }
    public int ItemCount { get; set; }
}
