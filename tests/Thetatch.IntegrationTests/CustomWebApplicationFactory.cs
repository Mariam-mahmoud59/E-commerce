using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Thetatch.Infrastructure.Data;

namespace Thetatch.IntegrationTests;

public class CustomWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        
        builder.ConfigureAppConfiguration((context, config) =>
        {
            var testConfig = new Dictionary<string, string?>
            {
                { "AuthRateLimit:PermitLimit", "10000" },
                { "AuthRateLimit:WindowMinutes", "15" },
                { "Cors:AllowedOrigins:0", "http://localhost:5173" }
            };
            config.AddInMemoryCollection(testConfig);
        });

        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<ApplicationDbContext>));
            services.RemoveAll(typeof(DbContextOptions));
            services.RemoveAll(typeof(ApplicationDbContext));

            var dbName = Guid.NewGuid().ToString();
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseInMemoryDatabase(dbName);
            });

        });
    }
}
