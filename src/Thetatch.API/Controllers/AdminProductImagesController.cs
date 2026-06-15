using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Thetatch.Application.Interfaces;
using Thetatch.Domain.Entities;

namespace Thetatch.API.Controllers;

[ApiController]
[Route("api/v1/admin/products/{productId:guid}/images")]
[Authorize(Roles = "Admin")]
public class AdminProductImagesController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IImageStorageService _imageStorage;

    public AdminProductImagesController(IApplicationDbContext context, IImageStorageService imageStorage)
    {
        _context = context;
        _imageStorage = imageStorage;
    }

    [HttpPost]
    public async Task<ActionResult> UploadImage(Guid productId, IFormFile file)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound();

        if (file == null || file.Length == 0)
            return BadRequest("File is empty.");

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest("File size exceeds 5MB.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp")
            return BadRequest("Invalid file type. Only JPG, PNG, and WEBP are allowed.");

        using var stream = file.OpenReadStream();
        var url = await _imageStorage.SaveImageAsync(stream, file.FileName, "images/products");

        var currentImageCount = await _context.ProductImages.CountAsync(i => i.ProductId == productId);

        var image = new ProductImage
        {
            ProductId = productId,
            Url = url,
            AltText = file.FileName,
            IsPrimary = currentImageCount == 0,
            SortOrder = currentImageCount
        };

        _context.ProductImages.Add(image);
        await _context.SaveChangesAsync();

        return Ok(new { image.Id, image.Url, image.IsPrimary });
    }

    [HttpPut("{imageId:guid}/primary")]
    public async Task<ActionResult> SetPrimary(Guid productId, Guid imageId)
    {
        var images = await _context.ProductImages.Where(i => i.ProductId == productId).ToListAsync();
        if (!images.Any(i => i.Id == imageId)) return NotFound();

        foreach (var img in images)
        {
            img.IsPrimary = img.Id == imageId;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{imageId:guid}")]
    public async Task<ActionResult> DeleteImage(Guid productId, Guid imageId)
    {
        var image = await _context.ProductImages.FirstOrDefaultAsync(i => i.Id == imageId && i.ProductId == productId);
        if (image == null) return NotFound();

        await _imageStorage.DeleteImageAsync(image.Url);
        _context.ProductImages.Remove(image);

        if (image.IsPrimary)
        {
            var nextPrimary = await _context.ProductImages
                .Where(i => i.ProductId == productId && i.Id != imageId)
                .OrderBy(i => i.SortOrder)
                .FirstOrDefaultAsync();
                
            if (nextPrimary != null) nextPrimary.IsPrimary = true;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
