using FluentValidation;
using Thetatch.Application.DTOs.Auth;
using Thetatch.Application.Interfaces;

namespace Thetatch.Application.Validators.Auth;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator(ICurrentLanguageService languageService)
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(x => languageService.Language == "ar" ? "البريد الإلكتروني مطلوب" : "Email is required")
            .EmailAddress().WithMessage(x => languageService.Language == "ar" ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage(x => languageService.Language == "ar" ? "كلمة المرور مطلوبة" : "Password is required");
    }
}
