using Storage.Dtos.Common;
using Storage.Entities.Concrete;

namespace Storage.Repositories.Abstract
{
    public interface IProductRepository
    {
        PagedResult<Product> GetAll(string companyId, int page, int pageSize, string? keyword, string? status);
        Product? GetById(int id, string companyId);
        Product Create(Product product);
        Product Update(Product product);
        void AddStockAction(StockAction stockAction);
        List<StockAction> GetStockHistory(int productId, string companyId);
    }
}