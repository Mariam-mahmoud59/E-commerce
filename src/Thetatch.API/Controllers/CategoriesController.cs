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
    public async Task<ActionResult<Thetatch.SharedKernel.PagedResult<CategoryResponse>>> GetCategories(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var language = _languageService.Language;

        var query = _context.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder);

        var totalCount = await query.CountAsync();

        var categories = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = categories.Select(c => new CategoryResponse
        {
            Id = c.Id,
            Slug = c.Slug,
            Name = c.Name.GetTranslation(language),
            Description = c.Description.GetTranslation(language),
            ParentCategoryId = c.ParentCategoryId,
            SortOrder = c.SortOrder
        }).ToList();

        return Ok(new Thetatch.SharedKernel.PagedResult<CategoryResponse>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }
}
