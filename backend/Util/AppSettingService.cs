namespace Util.AppSettings
{
    public class AppSettingsService
    {
        private IConfiguration configuration;
        public AppSettingsService() 
        {
            var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: false);
            this.configuration = builder.Build();
        }

        public string GetConnectionString()
        {
            return this.configuration.GetValue<string>("ConnectionStrings:Local");
        }
    }
}
