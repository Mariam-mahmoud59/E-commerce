using FluentValidation;
using Thetatch.Application.DTOs.Orders;
using Thetatch.Application.Interfaces;

namespace Thetatch.Application.Validators.Orders;

public class UpdateOrderNotesRequestValidator : AbstractValidator<UpdateOrderNotesRequest>
{
    public UpdateOrderNotesRequestValidator(ICurrentLanguageService languageService)
    {
        RuleFor(x => x.Notes)
            .NotEmpty()
            .WithMessage(_ => languageService.Language == "ar" ? "الملاحظات مطلوبة" : "Notes are required")
            .MaximumLength(2000)
            .WithMessage(_ => languageService.Language == "ar" ? "الملاحظات طويلة جداً" : "Notes are too long");
    }
}
