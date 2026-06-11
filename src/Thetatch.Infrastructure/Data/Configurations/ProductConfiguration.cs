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

        builder.OwnsOne(p => p.Name, name =>
        {
            name.ToJson();
            name.Property(n => n.En).HasColumnName("Name_En");
            name.Property(n => n.Ar).HasColumnName("Name_Ar");
        });

        builder.OwnsOne(p => p.Description, desc =>
        {
            desc.ToJson();
            desc.Property(d => d.En).HasColumnName("Description_En");
            desc.Property(d => d.Ar).HasColumnName("Description_Ar");
        });

        builder.OwnsOne(p => p.SeoTitle, seo =>
        {
            seo.ToJson();
            seo.Property(s => s.En).HasColumnName("SeoTitle_En");
            seo.Property(s => s.Ar).HasColumnName("SeoTitle_Ar");
        });

        builder.OwnsOne(p => p.SeoDescription, seo =>
        {
            seo.ToJson();
            seo.Property(s => s.En).HasColumnName("SeoDescription_En");
            seo.Property(s => s.Ar).HasColumnName("SeoDescription_Ar");
        });

        builder.Property(p => p.BasePrice).HasColumnType("decimal(18,2)");
        builder.Property(p => p.CompareAtPrice).HasColumnType("decimal(18,2)");

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
