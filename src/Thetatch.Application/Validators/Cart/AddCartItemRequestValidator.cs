using FluentValidation;
using Thetatch.Application.DTOs.Cart;
using Thetatch.Application.Interfaces;

namespace Thetatch.Application.Validators.Cart;

public class AddCartItemRequestValidator : AbstractValidator<AddCartItemRequest>
{
    public AddCartItemRequestValidator(ICurrentLanguageService languageService)
    {
        RuleFor(x => x.ProductVariantId)
            .NotEmpty()
            .WithMessage(_ => languageService.Language == "ar" ? "معرف المتغير مطلوب" : "Product variant is required");

        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage(_ => languageService.Language == "ar" ? "الكمية يجب أن تكون أكبر من صفر" : "Quantity must be greater than zero");
    }
}
