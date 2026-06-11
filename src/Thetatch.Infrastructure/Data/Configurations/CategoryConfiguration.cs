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

        builder.OwnsOne(c => c.Name, name =>
        {
            name.ToJson();
            name.Property(n => n.En).HasColumnName("Name_En");
            name.Property(n => n.Ar).HasColumnName("Name_Ar");
        });

        builder.OwnsOne(c => c.Description, desc =>
        {
            desc.ToJson();
            desc.Property(d => d.En).HasColumnName("Description_En");
            desc.Property(d => d.Ar).HasColumnName("Description_Ar");
        });

        builder.HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
