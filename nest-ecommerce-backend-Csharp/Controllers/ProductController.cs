using back_end.Entities;
using back_end.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        public readonly web_apiContext _context;
        private readonly IConfiguration _config;

        public ProductController(web_apiContext ctx, IConfiguration config)
        {
            _context = ctx;
            _config = config;
        }

        [HttpGet("get-productss")]
        public IActionResult GetProducts()
        {
            var products = _context.Products.Where(p => p.IsDeleted != true).ToList();
            return Ok(new { message = "success", products });
        }

        [HttpGet("get-products")]
        public IActionResult GetProduct([FromQuery] int page, [FromQuery] int limit)
        {
            int countSkip = (page - 1) * limit;
            var products = _context.Products.Where(p => p.IsDeleted != true)
                .OrderBy(x => 1).Skip(countSkip).Take(limit).ToList();

            double count = _context.Products.Count();
            var countProduct = Math.Ceiling(count / limit);

            return Ok(new { message = "success", products, countProduct });
        }


        [HttpGet("product-detail/{id}")]
        public async Task<IActionResult> FindProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();
            return Ok(new { message = "success", product });
        }
    }
}
