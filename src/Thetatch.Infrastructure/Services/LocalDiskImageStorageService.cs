using System.IO;
using Microsoft.AspNetCore.Hosting;
using Thetatch.Application.Interfaces;

namespace Thetatch.Infrastructure.Services;

public class LocalDiskImageStorageService : IImageStorageService
{
    private readonly IWebHostEnvironment _env;

    public LocalDiskImageStorageService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> SaveImageAsync(Stream imageStream, string fileName, string directory, CancellationToken cancellationToken = default)
    {
        var uploadPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), directory);
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }

        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var filePath = Path.Combine(uploadPath, uniqueFileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await imageStream.CopyToAsync(fileStream, cancellationToken);
        }

        return $"/{directory}/{uniqueFileName}";
    }

    public Task DeleteImageAsync(string imageUrl, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(imageUrl)) return Task.CompletedTask;

        var relativePath = imageUrl.TrimStart('/');
        var filePath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), relativePath);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        return Task.CompletedTask;
    }
}
