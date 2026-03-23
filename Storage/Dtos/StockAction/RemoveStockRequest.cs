namespace Storage.Dtos.StockAction
{
    public class RemoveStockRequest
    {
        public string CompanyId { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string? Note { get; set; }
    }
}