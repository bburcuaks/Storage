using Storage.Dtos.Common;
using Storage.Dtos.Product;
using Storage.Dtos.StockAction;
using Storage.Entities.Concrete;

namespace Storage.Managers.Abstract
{
    public interface IProductManager
    {
        PagedResult<Product> GetAll(string companyId, int page, int pageSize, string? keyword, string? status);
        Product? GetById(int id, string companyId);
        Product Create(CreateProductRequest request);
        Product Update(UpdateProductRequest request);
        bool Delete(DeleteProductRequest request);
        Product AddStock(AddStockRequest request);
        Product RemoveStock(RemoveStockRequest request);

        List<StockAction> GetStockHistory(int productId, string companyId);

    }
}