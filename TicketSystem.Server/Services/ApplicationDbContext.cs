using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TicketSystem.Server.Models;

namespace TicketSystem.Server.Services;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
    {
    }



    public DbSet<User> Users { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Message> Messages { get; set; }



    protected override void OnModelCreating(ModelBuilder builder)
    {

        builder.Entity<User>(entity => 
        {
            entity.HasKey(x => x.Id);

        });

        builder.Entity<Ticket>(ent =>
        {
            ent.HasKey(t => t.Id);
            
            ent.HasOne(t => t.Owner)
                .WithMany(u => u.OwnedTickets)
                .HasForeignKey(t => t.OwnerId);

            ent.HasOne(t => t.Assignee)
                .WithMany(u => u.AssignedTickets)
                .HasForeignKey(t => t.AssigneeId);

            ent.HasMany(t => t.Messages)
                .WithOne(m => m.Ticket)
                .HasForeignKey(m => m.TicketId)
                .OnDelete(DeleteBehavior.Cascade); 
        });


        base.OnModelCreating(builder);

    }
}