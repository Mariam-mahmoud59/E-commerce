using Microsoft.EntityFrameworkCore;
using Thetatch.Domain.Entities;

namespace Thetatch.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Product> Products { get; }
    DbSet<ProductVariant> ProductVariants { get; }
    DbSet<Category> Categories { get; }
    DbSet<ProductImage> ProductImages { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<OrderStatusHistory> OrderStatusHistories { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
