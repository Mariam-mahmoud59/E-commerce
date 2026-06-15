using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Thetatch.Domain.Entities;

namespace Thetatch.Infrastructure.Data.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(c => c.Id);

        builder.HasIndex(c => c.Slug).IsUnique();

        builder.Property(c => c.Name)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Thetatch.Domain.Common.LocalizedText>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Thetatch.Domain.Common.LocalizedText());

        builder.Property(c => c.Description)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Thetatch.Domain.Common.LocalizedText>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Thetatch.Domain.Common.LocalizedText());

        builder.HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
