using FluentValidation;
using Thetatch.Application.DTOs.Auth;
using Thetatch.Application.Interfaces;

namespace Thetatch.Application.Validators.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator(ICurrentLanguageService languageService)
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage(x => languageService.Language == "ar" ? "الاسم الكامل مطلوب" : "Full name is required")
            .MaximumLength(100).WithMessage(x => languageService.Language == "ar" ? "الاسم الكامل يجب ألا يتجاوز 100 حرف" : "Full name must not exceed 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(x => languageService.Language == "ar" ? "البريد الإلكتروني مطلوب" : "Email is required")
            .EmailAddress().WithMessage(x => languageService.Language == "ar" ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage(x => languageService.Language == "ar" ? "كلمة المرور مطلوبة" : "Password is required")
            .MinimumLength(6).WithMessage(x => languageService.Language == "ar" ? "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل" : "Password must be at least 6 characters");
    }
}
