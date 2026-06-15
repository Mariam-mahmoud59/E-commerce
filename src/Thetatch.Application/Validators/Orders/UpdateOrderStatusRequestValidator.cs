using FluentValidation;
using Thetatch.Application.DTOs.Orders;
using Thetatch.Application.Interfaces;

namespace Thetatch.Application.Validators.Orders;

public class UpdateOrderStatusRequestValidator : AbstractValidator<UpdateOrderStatusRequest>
{
    public UpdateOrderStatusRequestValidator(ICurrentLanguageService languageService)
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage(x => languageService.Language == "ar" ? "حالة الطلب غير صالحة" : "Invalid order status");
    }
}
