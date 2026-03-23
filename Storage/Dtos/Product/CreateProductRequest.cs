namespace Storage.Dtos.Product
{
    public class CreateProductRequest
    {
        public string CompanyId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string ProductCode { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Description { get; set; }
    }
}