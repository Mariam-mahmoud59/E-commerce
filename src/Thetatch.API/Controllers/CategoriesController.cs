using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Thetatch.Application.DTOs.Categories;
using Thetatch.Application.Interfaces;

namespace Thetatch.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public CategoriesController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoryResponse>>> GetCategories()
    {
        var language = Request.Headers.AcceptLanguage.ToString().Split(',').FirstOrDefault()?.Split(';').FirstOrDefault()?.ToLower() ?? "en";
        if (!language.StartsWith("ar")) language = "en";
        else language = "ar";

        var categories = await _context.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .ToListAsync();

        var response = categories.Select(c => new CategoryResponse
        {
            Id = c.Id,
            Slug = c.Slug,
            Name = c.Name.GetTranslation(language),
            Description = c.Description.GetTranslation(language),
            ParentCategoryId = c.ParentCategoryId,
            SortOrder = c.SortOrder
        }).ToList();

        return Ok(response);
    }
}
