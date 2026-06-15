using Microsoft.EntityFrameworkCore;
using Thetatch.Domain.Common;
using Thetatch.Domain.Entities;
using Thetatch.Domain.Enums;

namespace Thetatch.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedSampleDataAsync(ApplicationDbContext context)
    {
        if (await context.Categories.AnyAsync())
        {
            return; // DB has been seeded
        }

        var electronicsCategory = new Category
        {
            Name = new LocalizedText("Electronics", "إلكترونيات"),
            Description = new LocalizedText("Electronic devices and gadgets", "الأجهزة والأدوات الإلكترونية"),
            IsActive = true,
            Slug = "electronics"
        };

        var clothingCategory = new Category
        {
            Name = new LocalizedText("Clothing", "ملابس"),
            Description = new LocalizedText("Men and women clothing", "ملابس رجالية ونسائية"),
            IsActive = true,
            Slug = "clothing"
        };

        await context.Categories.AddRangeAsync(electronicsCategory, clothingCategory);

        var laptop = new Product
        {
            Name = new LocalizedText("Gaming Laptop", "لابتوب ألعاب"),
            Description = new LocalizedText("High performance gaming laptop with RTX 4070", "لابتوب ألعاب عالي الأداء مع كرت شاشة RTX 4070"),
            BasePrice = 1500.00m,
            Category = electronicsCategory,
            Status = ProductStatus.Active,
            SeoTitle = new LocalizedText("Gaming Laptop", "لابتوب ألعاب"),
            SeoDescription = new LocalizedText("Buy the best gaming laptop", "تسوق أفضل لابتوب ألعاب"),
            Slug = "gaming-laptop"
        };

        var smartphone = new Product
        {
            Name = new LocalizedText("Smartphone 5G", "هاتف ذكي 5G"),
            Description = new LocalizedText("Latest 5G smartphone with great camera", "أحدث هاتف ذكي يدعم 5G مع كاميرا ممتازة"),
            BasePrice = 800.00m,
            Category = electronicsCategory,
            Status = ProductStatus.Active,
            SeoTitle = new LocalizedText("Smartphone 5G", "هاتف ذكي 5G"),
            SeoDescription = new LocalizedText("Buy 5G smartphones", "تسوق هواتف 5G"),
            Slug = "smartphone-5g"
        };

        var tShirt = new Product
        {
            Name = new LocalizedText("Cotton T-Shirt", "تي شيرت قطني"),
            Description = new LocalizedText("100% cotton casual t-shirt", "تي شيرت كاجوال قطن 100٪"),
            BasePrice = 20.00m,
            Category = clothingCategory,
            Status = ProductStatus.Active,
            SeoTitle = new LocalizedText("Cotton T-Shirt", "تي شيرت قطني"),
            SeoDescription = new LocalizedText("Buy comfortable t-shirts", "تسوق تي شيرتات مريحة"),
            Slug = "cotton-tshirt"
        };

        await context.Products.AddRangeAsync(laptop, smartphone, tShirt);
        await context.SaveChangesAsync();

        await context.ProductVariants.AddRangeAsync(
            new ProductVariant
            {
                ProductId = laptop.Id,
                SKU = "LAP-001",
                StockQuantity = 10,
                IsActive = true
            },
            new ProductVariant
            {
                ProductId = smartphone.Id,
                SKU = "PHN-001",
                StockQuantity = 25,
                IsActive = true
            },
            new ProductVariant
            {
                ProductId = tShirt.Id,
                SKU = "TSH-001",
                Size = "M",
                Color = "White",
                StockQuantity = 50,
                IsActive = true
            });

        await context.SaveChangesAsync();
    }
}
