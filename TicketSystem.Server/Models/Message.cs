using System.ComponentModel.DataAnnotations.Schema;

namespace TicketSystem.Server.Models
{
    public class Message
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool AdminOnly { get; set; }


        public User? Owner { get; set; } = null;

        [ForeignKey("TicketId")]
        public Ticket? Ticket { get; set; } = null;
        public Guid? TicketId { get; set; }
    }
}
