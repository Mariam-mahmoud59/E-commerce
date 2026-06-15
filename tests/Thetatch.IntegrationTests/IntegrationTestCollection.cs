namespace Thetatch.IntegrationTests;

[CollectionDefinition("Integration")]
public class IntegrationTestCollection : ICollectionFixture<CustomWebApplicationFactory<Program>>
{
}
