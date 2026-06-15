using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Thetatch.Domain.Entities;

namespace Thetatch.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.HasIndex(o => o.OrderNumber).IsUnique();
        builder.HasIndex(o => o.IdempotencyKey).IsUnique();
        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => new { o.CustomerId, o.CreatedAt });

        builder.Property(o => o.SubTotal).HasColumnType("decimal(18,2)");
        builder.Property(o => o.DiscountAmount).HasColumnType("decimal(18,2)");
        builder.Property(o => o.ShippingCost).HasColumnType("decimal(18,2)");
        builder.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");

        builder.Property(o => o.ShippingAddressSnapshot)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonDocument.Parse(v, new System.Text.Json.JsonDocumentOptions()));

        builder.HasOne(o => o.Customer)
            .WithMany()
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.Items)
            .WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.StatusHistory)
            .WithOne(h => h.Order)
            .HasForeignKey(h => h.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
