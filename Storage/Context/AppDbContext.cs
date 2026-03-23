using Microsoft.EntityFrameworkCore;
using Storage.Entities.Concrete;

namespace Storage.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<StockAction> StockActions { get; set; }
    }
}