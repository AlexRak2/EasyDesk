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
    public class TicketController : Controller
    {

        private readonly ILogger<TicketController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public TicketController(ILogger<TicketController> logger, ApplicationDbContext context, UserManager<User> userManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
        }


        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody]Ticket request)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.Email == User.Identity.Name);

            Ticket ticket = new Ticket();

            ticket.Title = request.Title;
            ticket.Description = request.Description;
            ticket.Priority = request.Priority;
            ticket.Status = request.Status;
            ticket.CreatedAt = request.CreatedAt;
            ticket.DueAt = request.DueAt;
            ticket.AssigneeId = request.Assignee?.Id;
            ticket.Owner = user;
    
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return Ok(ticket.Id);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateTicket(Ticket request)
        {
            User? user = await _context.Users
                .Where(x => x.Email == User.Identity.Name)
                .Select(x => new Models.User
                {
                    Id = x.Id,
                })
                .FirstOrDefaultAsync();


            bool isAdmin = await user.IsAdmin(_userManager);

            if(!isAdmin)
                return BadRequest();

            Ticket? ticket = await _context.Tickets.FirstOrDefaultAsync(x => x.Id == request.Id);

            if(ticket == null)
                return BadRequest("Ticket not found.");

            _context.Update(ticket);

            ticket.Title = request.Title;
            ticket.Description = request.Description;
            ticket.Priority = request.Priority;
            ticket.Status = request.Status;
            // ticket.CreatedAt = request.CreatedAt;
            ticket.DueAt = request.DueAt;
            ticket.AssigneeId = request.Assignee?.Id;


            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> DeleteTicket(string ticketId)
        {
            User? user = await _context.Users
                .Where(x => x.Email == User.Identity.Name)
                .Select(x => new Models.User
                {
                    Id = x.Id,
                })
                .FirstOrDefaultAsync();

            bool isAdmin = await user.IsAdmin(_userManager);

            if(!isAdmin)
                return BadRequest();



            Ticket? ticket = await _context.Tickets.FirstOrDefaultAsync(x => x.Id.ToString() == ticketId);
            _context.Remove(ticket);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetTicketData(string ticketId)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.Email == User.Identity.Name);
            bool isAdmin = await user.IsAdmin(_userManager);

            Ticket? ticket = await _context.Tickets
            .Select(ticket => new Ticket
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Status = ticket.Status,
                Priority = ticket.Priority,
                CreatedAt = ticket.CreatedAt,
                DueAt = ticket.DueAt,
                Messages = ticket.Messages.Where(x => isAdmin || !x.AdminOnly)
                .Select(x => new Message()
                {
                    Id = x.Id,
                    Owner = x.Owner,
                    Content = x.Content,
                    CreatedAt = x.CreatedAt,
                    AdminOnly = x.AdminOnly
                }).ToList(),
                Owner = new User()
                {
                    Id = ticket.OwnerId ?? Guid.Empty,
                    Email = ticket.Owner.Email,
                },
                Assignee = ticket.Assignee == null
                    ? null
                    : new User()
                    {
                        Id = ticket.AssigneeId ?? Guid.Empty,
                        Email = ticket.Assignee.Email
                    },
            })
            .FirstOrDefaultAsync(x => x.Id.ToString() == ticketId);

            if (ticket == null)
                return NotFound("Ticket not found");

            return Ok(ticket);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetAllTickets()
        {
            _logger.LogWarning(User.Identity.Name);

            User? user = await _context.Users
                .Where(x => x.Email == User.Identity.Name)
                .Select(x => new Models.User
                {
                    Id = x.Id,
                })
                .FirstOrDefaultAsync();

            var ticketsQuery = _context.Tickets.AsQueryable();

            if (!user.IsAdmin(_userManager).Result)
            {
                ticketsQuery = ticketsQuery.Where(ticket => ticket.OwnerId == user.Id);
            }

            var tickets = await ticketsQuery
                .Select(ticket => new Ticket
                {
                    Id = ticket.Id,
                    Title = ticket.Title,
                    Description = ticket.Description,
                    Status = ticket.Status,
                    Priority = ticket.Priority,
                    CreatedAt = ticket.CreatedAt,
                    DueAt = ticket.DueAt,
                    Owner = new User()
                    {
                        Id = ticket.OwnerId ?? Guid.Empty,
                        Email = ticket.Owner.Email,
                    },
                    Assignee = ticket.Assignee == null
                        ? null
                        : new User()
                        {
                            Id = ticket.AssigneeId ?? Guid.Empty,
                            Email = ticket.Assignee.Email
                        },
                }).ToListAsync();
                                        
            return Ok(tickets);
        }


        [HttpPut]
        public async Task<IActionResult> SendMessage([FromBody] MessageRequest messageReq)
        {
            
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.Email == User.Identity.Name);

            //send email
            //check if ticket is valid
            //check if user has access to ticket
            
            Message message = new Message();
            message.Content = messageReq.content;
            message.TicketId = Guid.Parse(messageReq.ticketId);
            message.Owner = user;
            message.AdminOnly = messageReq.adminOnly;

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();


            return Ok(message);
        }
    }

    public class TicketRequest
    {   
        public string? ticketId {get;set;}
    }

    public class MessageRequest
    {   
        public string? ticketId {get;set;}
        public string? content {get;set;}
        public bool adminOnly {get;set;} = false;
    }
}
