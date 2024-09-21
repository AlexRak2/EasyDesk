using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketSystem.Server.Models
{
    public enum Priority 
    {
        Low,
        Medium,
        High
    }

    public enum Status
    {
    Deployed,
    PendingRelease,
    InQueue,
    Assigned,
    InProgress,
    UAT,
    Closed
    }

    public class Ticket
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;

        public Priority Priority { get; set; } = Priority.Low;
        public Status Status { get; set; } = Status.InQueue;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime DueAt { get; set; } = DateTime.Now.AddDays(15);

        //references
        [ForeignKey("OwnerId")]
        public User? Owner { get; set; }
        public Guid? OwnerId { get; set; }

        [ForeignKey("AssigneeId")]
        public User? Assignee { get; set; }
        public Guid? AssigneeId { get; set; }

        public ICollection<Message>? Messages { get; set; } = null;
    }
}
