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
    public class ShopController : ControllerBase
    {
        public readonly web_apiContext _context;
        private readonly IConfiguration _config;

        public ShopController(web_apiContext ctx, IConfiguration config)
        {
            _context = ctx;
            _config = config;
        }
        [HttpGet("get-category")]
        public IActionResult GetCategory()
        {
            var categories = _context.Categories.ToList();
            return Ok(new { message = "success", categories });
        }

        [HttpGet("shop")]
        public async Task<IActionResult> Shop([FromQuery] int page, [FromQuery] int limit, [FromQuery] string cate )
        {
            int countSkip = (page - 1) * limit;

            var products = new List<Product>();
            double countProduct = 0;

            if (cate != "null")
            {
                var categoryId = await _context.Categories.FirstOrDefaultAsync(c => c.Cate == cate);
                var query = _context.Products.Where(p => p.CategoryId == categoryId.CategoryId);

                countProduct = query.Count();
                countProduct = Math.Ceiling(countProduct / limit);

                products = query.OrderBy(x => 1).Skip(countSkip).Take(limit).ToList();
                return Ok(new { message = "success", products, countProduct });
            }

            countProduct = await _context.Products.CountAsync();
            countProduct = Math.Ceiling(countProduct / limit);

            products = _context.Products.OrderBy(x => 1).Skip(countSkip).Take(limit).ToList();

            return Ok(new { message = "success", products, countProduct });
        }
    }
}
