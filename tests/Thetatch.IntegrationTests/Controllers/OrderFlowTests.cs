using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Thetatch.Application.DTOs.Auth;
using Thetatch.Application.DTOs.Cart;
using Thetatch.Application.DTOs.Orders;
using Thetatch.Application.DTOs.Products;
using Thetatch.Domain.Enums;

namespace Thetatch.IntegrationTests.Controllers;

[Collection("Integration")]
public class OrderFlowTests
{
    private readonly HttpClient _client;

    public OrderFlowTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            HandleCookies = false
        });
    }

    [Fact]
    public async Task OrderFlow_CreateFromCart_ProcessesStockAndSupportsIdempotency()
    {
        var customerToken = await RegisterAndLoginAsync();
        var variantId = await GetFirstVariantIdAsync();
        var initialStock = await GetVariantStockAsync(variantId);

        await AddCartItemAsync(customerToken, variantId, 2);

        var idempotencyKey = Guid.NewGuid().ToString("N");
        var orderRequest = new CreateOrderRequest
        {
            CustomerName = "Order Tester",
            CustomerPhone = "01000000000",
            ShippingAddress = new ShippingAddressDto
            {
                Line1 = "123 Test Street",
                City = "Cairo",
                Country = "Egypt"
            },
            PaymentMethod = PaymentMethod.CashOnDelivery,
            ShippingCost = 10
        };

        var firstOrderResponse = await SendAuthorizedPostAsync(
            "/api/v1/orders",
            customerToken,
            orderRequest,
            idempotencyKey);
        firstOrderResponse.EnsureSuccessStatusCode();
        var firstOrder = await firstOrderResponse.Content.ReadFromJsonAsync<OrderResponse>();

        var secondOrderResponse = await SendAuthorizedPostAsync(
            "/api/v1/orders",
            customerToken,
            orderRequest,
            idempotencyKey);
        secondOrderResponse.EnsureSuccessStatusCode();
        var secondOrder = await secondOrderResponse.Content.ReadFromJsonAsync<OrderResponse>();

        Assert.NotNull(firstOrder);
        Assert.NotNull(secondOrder);
        Assert.Equal(firstOrder!.Id, secondOrder!.Id);
        Assert.Equal(OrderStatus.Pending, firstOrder.Status);
        Assert.Equal(PaymentMethod.CashOnDelivery, firstOrder.PaymentMethod);

        var cartResponse = await SendAuthorizedGetAsync("/api/v1/cart", customerToken);
        cartResponse.EnsureSuccessStatusCode();
        var cart = await cartResponse.Content.ReadFromJsonAsync<CartResponse>();
        Assert.NotNull(cart);
        Assert.Empty(cart!.Items);

        var adminToken = await LoginAsync("admin@horizons.com", "Admin@123");
        await UpdateOrderStatusAsync(adminToken, firstOrder.Id, OrderStatus.Contacted);
        await UpdateOrderStatusAsync(adminToken, firstOrder.Id, OrderStatus.Confirmed);
        await UpdateOrderStatusAsync(adminToken, firstOrder.Id, OrderStatus.Processing);

        var stockAfterProcessing = await GetVariantStockAsync(variantId);
        Assert.Equal(initialStock - 2, stockAfterProcessing);

        var processedOrder = await GetOrderAsync(customerToken, firstOrder.Id);
        Assert.True(processedOrder.StockDecremented);
        Assert.Equal(OrderStatus.Processing, processedOrder.Status);

        await UpdateOrderStatusAsync(adminToken, firstOrder.Id, OrderStatus.Cancelled);

        var stockAfterCancel = await GetVariantStockAsync(variantId);
        Assert.Equal(initialStock, stockAfterCancel);

        var cancelledOrder = await GetOrderAsync(customerToken, firstOrder.Id);
        Assert.Equal(OrderStatus.Cancelled, cancelledOrder.Status);
        Assert.False(cancelledOrder.StockDecremented);
    }

    [Fact]
    public async Task AdminUpdateStatus_WithInvalidTransition_ReturnsBadRequest()
    {
        var customerToken = await RegisterAndLoginAsync();
        var variantId = await GetFirstVariantIdAsync();
        await AddCartItemAsync(customerToken, variantId, 1);

        var order = await CreateOrderAsync(customerToken, PaymentMethod.CashOnDelivery);
        var adminToken = await LoginAsync("admin@horizons.com", "Admin@123");

        var response = await SendAuthorizedPatchAsync(
            $"/api/adminorders/{order.Id}/status",
            adminToken,
            new UpdateOrderStatusRequest { Status = OrderStatus.Processing });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CustomerOrders_ReturnOnlyOwnOrders()
    {
        var customerToken = await RegisterAndLoginAsync();
        var variantId = await GetFirstVariantIdAsync();
        await AddCartItemAsync(customerToken, variantId, 1);
        await CreateOrderAsync(customerToken, PaymentMethod.CashOnDelivery);

        var response = await SendAuthorizedGetAsync("/api/v1/orders", customerToken);
        response.EnsureSuccessStatusCode();
        var orders = await response.Content.ReadFromJsonAsync<List<OrderSummaryResponse>>();

        Assert.NotNull(orders);
        Assert.Single(orders!);
    }

    private async Task<string> RegisterAndLoginAsync()
    {
        var email = $"order-{Guid.NewGuid():N}@example.com";
        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest
        {
            FullName = "Order Tester",
            Email = email,
            Phone = "01000000000",
            Password = "Pass@1234",
            PreferredLanguage = "en"
        });
        registerResponse.EnsureSuccessStatusCode();

        return await LoginAsync(email, "Pass@1234");
    }

    private async Task<string> LoginAsync(string email, string password)
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = email,
            Password = password
        });
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<AuthResponse>();
        return body!.Token;
    }

    private async Task<Guid> GetFirstVariantIdAsync()
    {
        var response = await _client.GetAsync("/api/v1/products");
        response.EnsureSuccessStatusCode();
        var products = await response.Content.ReadFromJsonAsync<List<ProductResponse>>();
        var variantId = products!
            .SelectMany(p => p.Variants)
            .Select(v => v.Id)
            .FirstOrDefault();

        Assert.NotEqual(Guid.Empty, variantId);
        return variantId;
    }

    private async Task<int> GetVariantStockAsync(Guid variantId)
    {
        var response = await _client.GetAsync("/api/v1/products");
        response.EnsureSuccessStatusCode();
        var products = await response.Content.ReadFromJsonAsync<List<ProductResponse>>();
        return products!
            .SelectMany(p => p.Variants)
            .First(v => v.Id == variantId)
            .StockQuantity;
    }

    private async Task AddCartItemAsync(string token, Guid variantId, int quantity)
    {
        var response = await SendAuthorizedPostAsync(
            "/api/v1/cart/items",
            token,
            new AddCartItemRequest { ProductVariantId = variantId, Quantity = quantity });
        response.EnsureSuccessStatusCode();
    }

    private async Task<OrderResponse> CreateOrderAsync(string token, PaymentMethod paymentMethod)
    {
        var response = await SendAuthorizedPostAsync(
            "/api/v1/orders",
            token,
            new CreateOrderRequest
            {
                CustomerName = "Order Tester",
                CustomerPhone = "01000000000",
                ShippingAddress = new ShippingAddressDto
                {
                    Line1 = "123 Test Street",
                    City = "Cairo",
                    Country = "Egypt"
                },
                PaymentMethod = paymentMethod,
                ShippingCost = 10
            },
            Guid.NewGuid().ToString("N"));

        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<OrderResponse>())!;
    }

    private async Task<OrderResponse> GetOrderAsync(string token, Guid orderId)
    {
        var response = await SendAuthorizedGetAsync($"/api/v1/orders/{orderId}", token);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<OrderResponse>())!;
    }

    private async Task UpdateOrderStatusAsync(string adminToken, Guid orderId, OrderStatus status)
    {
        var response = await SendAuthorizedPatchAsync(
            $"/api/adminorders/{orderId}/status",
            adminToken,
            new UpdateOrderStatusRequest { Status = status });
        response.EnsureSuccessStatusCode();
    }

    private async Task<HttpResponseMessage> SendAuthorizedGetAsync(string url, string accessToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        return await _client.SendAsync(request);
    }

    private async Task<HttpResponseMessage> SendAuthorizedPostAsync<T>(
        string url,
        string accessToken,
        T body,
        string? idempotencyKey = null)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = JsonContent.Create(body)
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        if (!string.IsNullOrWhiteSpace(idempotencyKey))
        {
            request.Headers.Add("Idempotency-Key", idempotencyKey);
        }

        return await _client.SendAsync(request);
    }

    private async Task<HttpResponseMessage> SendAuthorizedPatchAsync<T>(string url, string accessToken, T body)
    {
        using var request = new HttpRequestMessage(HttpMethod.Patch, url)
        {
            Content = JsonContent.Create(body)
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        return await _client.SendAsync(request);
    }
}
