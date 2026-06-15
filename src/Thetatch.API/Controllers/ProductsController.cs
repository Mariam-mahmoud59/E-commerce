using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Thetatch.Application.DTOs.Products;
using Thetatch.Application.Interfaces;

namespace Thetatch.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentLanguageService _languageService;

    public ProductsController(IApplicationDbContext context, ICurrentLanguageService languageService)
    {
        _context = context;
        _languageService = languageService;
    }

    [HttpGet]
    public async Task<ActionResult<Thetatch.SharedKernel.PagedResult<ProductResponse>>> GetProducts(
        [FromQuery] string? categorySlug,
        [FromQuery] string? search,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? sortBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var language = _languageService.Language;

        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Where(p => p.Status == Domain.Enums.ProductStatus.Active && !p.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrEmpty(categorySlug))
        {
            query = query.Where(p => p.Category.Slug == categorySlug);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(p => p.BasePrice >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.BasePrice <= maxPrice.Value);
        }

        if (!string.IsNullOrEmpty(search))
        {
            var langKey = language.ToLower() == "ar" ? "Ar" : "En";
            query = query.Where(p => EF.Functions.ILike(
                EF.Property<string>(p, "Name"),
                $"%\"{langKey}\":\"%{search}%\"%"));
        }

        query = sortBy?.ToLower() switch
        {
            "price_asc" => query.OrderBy(p => p.BasePrice),
            "price_desc" => query.OrderByDescending(p => p.BasePrice),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            "name" => query.OrderBy(p => EF.Property<string>(p, "Name")),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var totalCount = await query.CountAsync();

        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = products.Select(p => new ProductResponse
        {
            Id = p.Id,
            Slug = p.Slug,
            Name = p.Name.GetTranslation(language),
            Description = p.Description.GetTranslation(language),
            BasePrice = p.BasePrice,
            CompareAtPrice = p.CompareAtPrice,
            CategoryId = p.CategoryId,
            CategoryName = p.Category.Name.GetTranslation(language),
            Tags = p.Tags,
            SeoTitle = p.SeoTitle.GetTranslation(language),
            SeoDescription = p.SeoDescription.GetTranslation(language),
            Images = p.Images.Select(i => new ProductImageResponse
            {
                Id = i.Id,
                Url = i.Url,
                AltText = i.AltText,
                IsPrimary = i.IsPrimary
            }).OrderBy(i => i.IsPrimary ? 0 : 1).ToList(),
            Variants = p.Variants.Where(v => v.IsActive).Select(v => new ProductVariantResponse
            {
                Id = v.Id,
                SKU = v.SKU,
                Size = v.Size,
                Color = v.Color,
                PriceOverride = v.PriceOverride,
                StockStatus = v.StockQuantity > v.LowStockThreshold ? Domain.Enums.StockStatus.InStock :
                              v.StockQuantity > 0 ? Domain.Enums.StockStatus.LowStock :
                              Domain.Enums.StockStatus.OutOfStock
            }).ToList()
        }).ToList();

        return Ok(new Thetatch.SharedKernel.PagedResult<ProductResponse>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductResponse>> GetProduct(string slug)
    {
        var language = _languageService.Language;

        var p = await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Images)
            .Include(x => x.Variants)
            .FirstOrDefaultAsync(x => x.Slug == slug && !x.IsDeleted && x.Status == Domain.Enums.ProductStatus.Active);

        if (p == null) return NotFound();

        var response = new ProductResponse
        {
            Id = p.Id,
            Slug = p.Slug,
            Name = p.Name.GetTranslation(language),
            Description = p.Description.GetTranslation(language),
            BasePrice = p.BasePrice,
            CompareAtPrice = p.CompareAtPrice,
            CategoryId = p.CategoryId,
            CategoryName = p.Category.Name.GetTranslation(language),
            Tags = p.Tags,
            SeoTitle = p.SeoTitle.GetTranslation(language),
            SeoDescription = p.SeoDescription.GetTranslation(language),
            Images = p.Images.Select(i => new ProductImageResponse
            {
                Id = i.Id,
                Url = i.Url,
                AltText = i.AltText,
                IsPrimary = i.IsPrimary
            }).OrderBy(i => i.IsPrimary ? 0 : 1).ToList(),
            Variants = p.Variants.Where(v => v.IsActive).Select(v => new ProductVariantResponse
            {
                Id = v.Id,
                SKU = v.SKU,
                Size = v.Size,
                Color = v.Color,
                PriceOverride = v.PriceOverride,
                StockStatus = v.StockQuantity > v.LowStockThreshold ? Domain.Enums.StockStatus.InStock :
                              v.StockQuantity > 0 ? Domain.Enums.StockStatus.LowStock :
                              Domain.Enums.StockStatus.OutOfStock
            }).ToList()
        };

        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        var slug = request.NameEn.ToLower().Replace(" ", "-").Trim();

        var product = new Domain.Entities.Product
        {
            Slug = slug + "-" + Guid.NewGuid().ToString().Substring(0, 4),
            Name = new Domain.Common.LocalizedText { En = request.NameEn, Ar = request.NameAr },
            Description = new Domain.Common.LocalizedText { En = request.DescriptionEn, Ar = request.DescriptionAr },
            BasePrice = request.BasePrice,
            CompareAtPrice = request.CompareAtPrice,
            CategoryId = request.CategoryId,
            Status = request.Status,
            SeoTitle = new Domain.Common.LocalizedText { En = request.NameEn, Ar = request.NameAr },
            SeoDescription = new Domain.Common.LocalizedText { En = request.DescriptionEn, Ar = request.DescriptionAr }
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { slug = product.Slug }, null);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteProduct(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.IsDeleted = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
