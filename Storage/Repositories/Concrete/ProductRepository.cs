using Microsoft.EntityFrameworkCore;
using Storage.Context;
using Storage.Dtos.Common;
using Storage.Entities.Concrete;
using Storage.Repositories.Abstract;

namespace Storage.Repositories.Concrete
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public PagedResult<Product> GetAll(string companyId, int page, int pageSize, string? keyword, string? status)
        {
            var query = _context.Products
                .Where(x => x.CompanyId == companyId && !x.IsDeleted);

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x =>
                    x.ProductName.Contains(keyword) ||
                    x.ProductCode.Contains(keyword) ||
                    (x.Category != null && x.Category.Contains(keyword)) ||
                    (x.Unit != null && x.Unit.Contains(keyword)) ||
                    (x.Description != null && x.Description.Contains(keyword)));
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                var s = status.Trim().ToLower();

                if (s == "outofstock" || s == "stokyok" || s == "stok yok")
                {
                    query = query.Where(x => x.CurrentStock == 0);
                }
                else if (s == "critical" || s == "kritik")
                {
                    query = query.Where(x => x.CurrentStock > 0 && x.CurrentStock < x.MinimumStock);
                }
                else if (s == "low" || s == "az")
                {
                    query = query.Where(x => x.CurrentStock == x.MinimumStock);
                }
                else if (s == "sufficient" || s == "yeterli")
                {
                    query = query.Where(x => x.CurrentStock > x.MinimumStock);
                }
            }

            var totalCount = query.Count();

            var items = query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return new PagedResult<Product>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public Product? GetById(int id, string companyId)
        {
            return _context.Products
                .FirstOrDefault(x => x.Id == id && x.CompanyId == companyId && !x.IsDeleted);
        }

        public Product Create(Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return product;
        }

        public Product Update(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
            _context.SaveChanges();
            return product;
        }
        public void AddStockAction(StockAction stockAction)
        {
            _context.StockActions.Add(stockAction);
            _context.SaveChanges();
        }

        public List<StockAction> GetStockHistory(int productId, string companyId)
        {
            return _context.StockActions
                .Where(x => x.ProductId == productId && x.CompanyId == companyId)
                .OrderByDescending(x => x.CreatedAt)
                .ToList();
        }
    }
}