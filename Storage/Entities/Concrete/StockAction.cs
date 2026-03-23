using Storage.Entities.Concrete;

public class StockAction
{
    public int Id { get; set; }
    public string CompanyId { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }

    public string ActionType { get; set; } // IN / OUT
    public int Quantity { get; set; }

    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

   
}