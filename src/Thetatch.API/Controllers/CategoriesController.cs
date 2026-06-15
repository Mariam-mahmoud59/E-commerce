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
    private readonly ICurrentLanguageService _languageService;

    public CategoriesController(IApplicationDbContext context, ICurrentLanguageService languageService)
    {
        _context = context;
        _languageService = languageService;
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoryResponse>>> GetCategories()
    {
        var language = _languageService.Language;

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
