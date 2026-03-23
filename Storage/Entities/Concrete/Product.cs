using System.ComponentModel.DataAnnotations;

namespace Storage.Entities.Concrete
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string CompanyId { get; set; } = string.Empty;

        [Required]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        public string ProductCode { get; set; } = string.Empty;

        public int CurrentStock { get; set; } = 0;
        public int MinimumStock { get; set; } = 0;

        public string Unit { get; set; } = string.Empty;

      
        public string? Category { get; set; }

        public string? Description { get; set; }

        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}