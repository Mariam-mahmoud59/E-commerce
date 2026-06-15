using FluentValidation;
using Thetatch.Application.DTOs.Orders;
using Thetatch.Application.Interfaces;

namespace Thetatch.Application.Validators.Orders;

public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator(ICurrentLanguageService languageService)
    {
        RuleFor(x => x.CustomerName)
            .NotEmpty()
            .WithMessage(_ => languageService.Language == "ar" ? "اسم العميل مطلوب" : "Customer name is required");

        RuleFor(x => x.CustomerPhone)
            .NotEmpty()
            .WithMessage(_ => languageService.Language == "ar" ? "رقم الهاتف مطلوب" : "Customer phone is required");

        RuleFor(x => x.ShippingAddress.Line1)
            .NotEmpty()
            .WithMessage(_ => languageService.Language == "ar" ? "عنوان الشحن مطلوب" : "Shipping address is required");

        RuleFor(x => x.ShippingAddress.City)
            .NotEmpty()
            .WithMessage(_ => languageService.Language == "ar" ? "المدينة مطلوبة" : "City is required");

        RuleFor(x => x.PaymentMethod)
            .IsInEnum()
            .WithMessage(_ => languageService.Language == "ar" ? "طريقة الدفع غير صالحة" : "Invalid payment method");

        RuleFor(x => x.ShippingCost)
            .GreaterThanOrEqualTo(0)
            .WithMessage(_ => languageService.Language == "ar" ? "تكلفة الشحن غير صالحة" : "Invalid shipping cost");
    }
}
