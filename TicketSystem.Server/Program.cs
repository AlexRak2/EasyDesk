
using TicketSystem.Server.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using TicketSystem.Server.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace TicketSystem.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
        
            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            }).AddCookie(options =>
            {
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

            builder.Services.AddControllers();  
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            builder.Services.AddIdentity<User, IdentityRole<Guid>>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddApiEndpoints();

            builder.Services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 5;
                options.SignIn.RequireConfirmedEmail = false;
            });

            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            var app = builder.Build();


            app.UseDefaultFiles();
            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.UseAuthentication();

            app.MapControllers();
            app.MapGroup("api").MapIdentityApi<User>();

            app.MapPost("/api/logout", async (SignInManager<User> signInManager) =>
            {
                await signInManager.SignOutAsync();
                return Results.Ok();
            });

            app.MapPost("/api/pingauth", async (ClaimsPrincipal user, UserManager<User> userManager) =>
            {
                var email = user.FindFirstValue(ClaimTypes.Email);
                var hasAuth = !string.IsNullOrEmpty(email);

                var userModel = await userManager.GetUserAsync(user);
                IList<string>? roles = null;
                if(userModel != null)
                {
                    roles = await userManager.GetRolesAsync(userModel);
                }

                string? role = roles?.FirstOrDefault();

                return Results.Json(new { Email = email, hasAuth, role});
            });

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
