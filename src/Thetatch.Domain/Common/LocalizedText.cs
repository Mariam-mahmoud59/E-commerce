namespace Thetatch.Domain.Common;

/// <summary>
/// Represents bilingual text (English and Arabic) stored as JSONB.
/// </summary>
public class LocalizedText
{
    public string En { get; set; } = string.Empty;
    public string Ar { get; set; } = string.Empty;

    public LocalizedText() { }

    public LocalizedText(string en, string ar)
    {
        En = en;
        Ar = ar;
    }

    /// <summary>
    /// Helper to get the correct language based on the requested locale.
    /// Defaults to English if the specified language is not supported.
    /// </summary>
    public string GetTranslation(string languageCode)
    {
        return languageCode.ToLower() == "ar" ? Ar : En;
    }
}
