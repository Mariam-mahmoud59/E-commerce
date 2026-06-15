namespace Thetatch.Application.Interfaces;

public interface IImageStorageService
{
    Task<string> SaveImageAsync(Stream imageStream, string fileName, string directory, CancellationToken cancellationToken = default);
    Task DeleteImageAsync(string imageUrl, CancellationToken cancellationToken = default);
}
