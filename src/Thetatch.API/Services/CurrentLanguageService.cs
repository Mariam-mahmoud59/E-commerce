using Thetatch.Application.Interfaces;

namespace Thetatch.API.Services;

public class CurrentLanguageService : ICurrentLanguageService
{
    private string _language = "en";

    public string Language => _language;

    public void SetLanguage(string languageCode)
    {
        if (string.IsNullOrWhiteSpace(languageCode)) return;
        
        var lang = languageCode.ToLower();
        if (lang.StartsWith("ar"))
        {
            _language = "ar";
        }
        else
        {
            _language = "en";
        }
    }
}
