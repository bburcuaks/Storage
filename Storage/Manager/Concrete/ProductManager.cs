using Storage.Dtos.Common;
using Storage.Dtos.Product;
using Storage.Dtos.StockAction;
using Storage.Entities.Concrete;
using Storage.Managers.Abstract;
using Storage.Repositories.Abstract;

namespace Storage.Managers.Concrete
{
    public class ProductManager : IProductManager
    {
        private readonly IProductRepository _repo;

        public ProductManager(IProductRepository repo)
        {
            _repo = repo;
        }

        public PagedResult<Product> GetAll(string companyId, int page, int pageSize, string? keyword, string? status)
        {
            if (string.IsNullOrWhiteSpace(companyId))
                throw new Exception("CompanyId is required.");

            return _repo.GetAll(companyId, page, pageSize, keyword, status);
        }

        public Product? GetById(int id, string companyId)
        {
            return _repo.GetById(id, companyId);
        }

        public Product Create(CreateProductRequest r)
        {
            if (string.IsNullOrWhiteSpace(r.CompanyId))
                throw new Exception("CompanyId is required.");

            var p = new Product
            {
                CompanyId = r.CompanyId,
                ProductName = r.ProductName,
                ProductCode = r.ProductCode,
                CurrentStock = r.CurrentStock,
                MinimumStock = r.MinimumStock,
                Unit = r.Unit,
                Category = r.Category,
                Description = r.Description,
                CreatedAt = DateTime.UtcNow
            };

            return _repo.Create(p);
        }

        public Product Update(UpdateProductRequest r)
        {
            var p = _repo.GetById(r.Id, r.CompanyId);
            if (p == null)
                throw new Exception("Product not found");

            p.ProductName = r.ProductName;
            p.ProductCode = r.ProductCode;
            p.CurrentStock = r.CurrentStock;
            p.MinimumStock = r.MinimumStock;
            p.Unit = r.Unit;
            p.Category = r.Category;
            p.Description = r.Description;
            p.UpdatedAt = DateTime.UtcNow;

            return _repo.Update(p);
        }

        public bool Delete(DeleteProductRequest r)
        {
            var p = _repo.GetById(r.Id, r.CompanyId);
            if (p == null)
                throw new Exception("Product not found");

            p.IsDeleted = true;
            p.UpdatedAt = DateTime.UtcNow;

            _repo.Update(p);
            return true;
        }

        public Product AddStock(AddStockRequest r)
        {
            if (string.IsNullOrWhiteSpace(r.CompanyId))
                throw new Exception("CompanyId is required.");

            if (r.Quantity <= 0)
                throw new Exception("Quantity must be greater than zero.");

            var p = _repo.GetById(r.ProductId, r.CompanyId);
            if (p == null)
                throw new Exception("Product not found");

            p.CurrentStock += r.Quantity;
            p.UpdatedAt = DateTime.UtcNow;

            _repo.AddStockAction(new StockAction
            {
                CompanyId = r.CompanyId,
                ProductId = p.Id,
                ActionType = "IN",
                Quantity = r.Quantity,
                Note = r.Note,
                CreatedAt = DateTime.UtcNow
            });

            return _repo.Update(p);
        }

        public Product RemoveStock(RemoveStockRequest r)
        {
            if (string.IsNullOrWhiteSpace(r.CompanyId))
                throw new Exception("CompanyId is required.");

            if (r.Quantity <= 0)
                throw new Exception("Quantity must be greater than zero.");

            var p = _repo.GetById(r.ProductId, r.CompanyId);
            if (p == null)
                throw new Exception("Product not found");

            if (p.CurrentStock < r.Quantity)
                throw new Exception("Not enough stock");

            p.CurrentStock -= r.Quantity;
            p.UpdatedAt = DateTime.UtcNow;

            _repo.AddStockAction(new StockAction
            {
                CompanyId = r.CompanyId,
                ProductId = p.Id,
                ActionType = "OUT",
                Quantity = r.Quantity,
                Note = r.Note,
                CreatedAt = DateTime.UtcNow
            });

            return _repo.Update(p);
        }

        public List<StockAction> GetStockHistory(int productId, string companyId)
        {
            if (string.IsNullOrWhiteSpace(companyId))
                throw new Exception("CompanyId is required.");

            return _repo.GetStockHistory(productId, companyId);
        }
    }
}