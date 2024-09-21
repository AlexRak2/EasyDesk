using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Server.Models;
using TicketSystem.Server.Services;

namespace TicketSystem.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UserController : Controller
    {

        private readonly ILogger<UserController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;


        public UserController(ILogger<UserController> logger, ApplicationDbContext context, UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;

        }

        [HttpGet]
        public async Task<IEnumerable<User>> GetAllAgents()
        {
            var agents = await _userManager.GetUsersInRoleAsync("Admin");

            return agents.Select(x => new User{
                Id = x.Id,
                Email = x.Email
            });
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            
            User? requester = await _context.Users.FirstOrDefaultAsync(x => x.Email == User.Identity.Name);
            var requesterRole = await _userManager.GetRolesAsync(requester);

            bool isAdmin = requesterRole.First() == "Admin";            
            
            if(!isAdmin)
                return BadRequest();

            var users = _userManager.Users.ToList();        
            var userList = new List<UserWithRoles>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                userList.Add(new UserWithRoles
                {
                    Id = user.Id,
                    Email = user.Email,
                    Roles = roles.FirstOrDefault()
                });
            }

            return Ok(userList);
        }

        [HttpGet]
        public IEnumerable<string> GetAllRoles()
        {
            var roles = _roleManager.Roles.Select(r => r.Name).ToList();
            return roles;
        }

        [HttpPost]
        public async Task<IActionResult> UpdateUserRole(UserRoleUpdate req)
        {
            // if(IsAdmin().Result)
            //     return BadRequest();


            User? user = await _context.Users.FirstOrDefaultAsync(x => x.Id.ToString() == req.Id);
            var roles = await _userManager.GetRolesAsync(user);

            if(roles != null && roles.Count > 0)
                await _userManager.RemoveFromRoleAsync(user, roles.First());

            await _userManager.AddToRoleAsync(user, req.Role);

            return Ok();
        }
    }
}
public class UserWithRoles
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Roles { get; set; }
}

public class UserRoleUpdate
{
    public string Id { get; set; }
    public string Role { get; set; }
}