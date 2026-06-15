using FluentValidation;
using Thetatch.Application.DTOs.Products;
using Thetatch.Application.Interfaces;

namespace Thetatch.Application.Validators.Products;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator(ICurrentLanguageService languageService)
    {
        RuleFor(x => x.NameEn)
            .NotEmpty().WithMessage(x => languageService.Language == "ar" ? "الاسم بالإنجليزية مطلوب" : "English name is required")
            .MaximumLength(200).WithMessage(x => languageService.Language == "ar" ? "الاسم بالإنجليزية يجب ألا يتجاوز 200 حرف" : "English name must not exceed 200 characters");

        RuleFor(x => x.NameAr)
            .NotEmpty().WithMessage(x => languageService.Language == "ar" ? "الاسم بالعربية مطلوب" : "Arabic name is required")
            .MaximumLength(200).WithMessage(x => languageService.Language == "ar" ? "الاسم بالعربية يجب ألا يتجاوز 200 حرف" : "Arabic name must not exceed 200 characters");

        RuleFor(x => x.BasePrice)
            .GreaterThan(0).WithMessage(x => languageService.Language == "ar" ? "يجب أن يكون السعر أكبر من صفر" : "Price must be greater than zero");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage(x => languageService.Language == "ar" ? "معرف الفئة مطلوب" : "Category ID is required");
    }
}
