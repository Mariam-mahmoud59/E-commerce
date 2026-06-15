namespace Thetatch.Application.Interfaces;

public interface ICurrentLanguageService
{
    string Language { get; }
    void SetLanguage(string languageCode);
}
