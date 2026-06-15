using Thetatch.Application.Interfaces;

namespace Thetatch.API.Middleware;

public class LanguageMiddleware
{
    private readonly RequestDelegate _next;

    public LanguageMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ICurrentLanguageService languageService)
    {
        var acceptLanguage = context.Request.Headers.AcceptLanguage.ToString();
        var language = acceptLanguage.Split(',').FirstOrDefault()?.Split(';').FirstOrDefault() ?? "en";
        
        languageService.SetLanguage(language);

        await _next(context);
    }
}
