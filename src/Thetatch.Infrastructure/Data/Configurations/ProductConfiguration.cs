using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Thetatch.Domain.Entities;

namespace Thetatch.Infrastructure.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.HasIndex(p => p.Slug).IsUnique();

        builder.Property(p => p.Name)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Thetatch.Domain.Common.LocalizedText>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Thetatch.Domain.Common.LocalizedText());

        builder.Property(p => p.Description)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Thetatch.Domain.Common.LocalizedText>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Thetatch.Domain.Common.LocalizedText());

        builder.Property(p => p.SeoTitle)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Thetatch.Domain.Common.LocalizedText>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Thetatch.Domain.Common.LocalizedText());

        builder.Property(p => p.SeoDescription)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Thetatch.Domain.Common.LocalizedText>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Thetatch.Domain.Common.LocalizedText());

        builder.Property(p => p.BasePrice).HasColumnType("decimal(18,2)");
        builder.Property(p => p.CompareAtPrice).HasColumnType("decimal(18,2)");

        builder.Property(p => p.Metadata)
            .HasColumnType("jsonb")
            .HasConversion(
                v => v != null ? System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null) : null,
                v => v != null ? System.Text.Json.JsonDocument.Parse(v, new System.Text.Json.JsonDocumentOptions()) : null);

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Variants)
            .WithOne(v => v.Product)
            .HasForeignKey(v => v.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Images)
            .WithOne(i => i.Product)
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
