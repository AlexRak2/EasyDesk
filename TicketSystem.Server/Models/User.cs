using Microsoft.AspNetCore.Identity;
using TicketSystem.Server.Services;

namespace TicketSystem.Server.Models;

public class User : IdentityUser<Guid>
{

    public ICollection<Ticket>? OwnedTickets { get; set; } = null;
    public ICollection<Ticket>? AssignedTickets { get; set;} = null;


    public async Task<bool> IsAdmin(UserManager<User> _userManager)
    {
            var requesterRole = await _userManager.GetRolesAsync(this);

            return requesterRole.First() == "Admin"; 
    }
}