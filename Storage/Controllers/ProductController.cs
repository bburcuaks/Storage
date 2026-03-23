using Microsoft.AspNetCore.Mvc;
using Storage.Dtos.Product;
using Storage.Dtos.StockAction;
using Storage.Managers.Abstract;

namespace Storage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductManager _manager;

        public ProductController(IProductManager manager)
        {
            _manager = manager;
        }

        [HttpGet]
        public IActionResult GetAll(string companyId, int page = 1, int pageSize = 10, string? keyword = null, string? status = null)
        {
            var result = _manager.GetAll(companyId, page, pageSize, keyword, status);
            return Ok(result);
        }

        [HttpPost("create")]
        public IActionResult Create([FromBody] CreateProductRequest request)
        {
            var result = _manager.Create(request);
            return Ok(result);
        }

        [HttpPost("update")]
        public IActionResult Update([FromBody] UpdateProductRequest request)
        {
            var result = _manager.Update(request);
            return Ok(result);
        }

        [HttpPost("delete")]
        public IActionResult Delete([FromBody] DeleteProductRequest request)
        {
            var result = _manager.Delete(request);
            return Ok(result);
        }

        [HttpPost("add-stock")]
        public IActionResult AddStock([FromBody] AddStockRequest request)
        {
            var result = _manager.AddStock(request);
            return Ok(result);
        }

        [HttpPost("remove-stock")]
        public IActionResult RemoveStock([FromBody] RemoveStockRequest request)
        {
            var result = _manager.RemoveStock(request);
            return Ok(result);
        }
        [HttpGet("{productId}/stock-history")]
        public IActionResult GetStockHistory(int productId, [FromQuery] string companyId)
        {
            var result = _manager.GetStockHistory(productId, companyId);
            return Ok(result);
        }
    }
}