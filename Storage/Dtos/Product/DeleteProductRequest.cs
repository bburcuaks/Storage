namespace Storage.Dtos.Product
{
    public class DeleteProductRequest
    {
        public int Id { get; set; }
        public string CompanyId { get; set; } = string.Empty;
    }
}