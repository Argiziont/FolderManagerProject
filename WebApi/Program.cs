using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace FolderProjectApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
         Host.CreateDefaultBuilder(args)
          .ConfigureWebHostDefaults(webBuilder =>
          {
              webBuilder.ConfigureKestrel((context, options) =>
              {
                  options.Limits.MaxRequestBodySize = 737280000;
              });
              webBuilder.UseStartup<Startup>()
                  .UseUrls("http://localhost:4000");
          });
    }
}
