using FolderProjectApp.Components.HelperComponents;
using FolderProjectApp.Hubs;
using FolderProjectApp.Models;
using FolderProjectApp.Models.Entity;
using FolderProjectApp.Services;
using FolderProjectApp.Services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NSwag;
using NSwag.Generation.Processors.Security;
using System.Linq;

namespace FolderProjectApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddControllers();
            string connectionString = Configuration.GetConnectionString("FolderFiles");

            services.AddDbContext<ApplicationDbContext>(options =>
               options.UseSqlServer(connectionString));
            //services.AddControllersWithViews();
            services.AddSignalR();

            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

            services.AddScoped<IUserAuthService, UserAuthService>();
            services.AddScoped<IApplicationDbContext, ApplicationDbContext>();
            services.AddScoped<IEFFileFolderContext, EFFileFolderContext>();
            //services.AddScoped<IHubContext<FolderHub>, IBasicHub>();
            services.AddOpenApiDocument(document =>
            {
                document.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.ApiKey,
                    Name = "Authorization",
                    In = OpenApiSecurityApiKeyLocation.Header,
                    Description = "Type into the textbox: Bearer {your JWT token}."
                });

                document.OperationProcessors.Add(
                    new AspNetCoreOperationSecurityScopeProcessor("JWT"));
                //      new OperationSecurityScopeProcessor("JWT"));
            });

            services.Configure<IISServerOptions>(options =>
            {
                options.MaxRequestBodySize = long.MaxValue;
            });
            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = long.MaxValue; // In case of multipart
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env is null)
            {
                throw new System.ArgumentNullException(nameof(env));
            }

            app.UseRouting();

            // global cors policy
            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials()
                .WithExposedHeaders("Content-Disposition")); // allow credentials

            // custom jwt auth middleware
            app.UseMiddleware<JwtMiddleware>();

            app.UseOpenApi();
            app.UseSwaggerUi3();

            app.UseSpa(spa => spa.Options.SourcePath = "ClientApp");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapHub<FolderHub>("/hubs/Folders");
            });

        }
    }
}
