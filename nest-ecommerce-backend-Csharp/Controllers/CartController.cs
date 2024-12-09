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
    public class CartController : ControllerBase
    {
        public readonly web_apiContext _context;
        private readonly IConfiguration _config;

        public CartController(web_apiContext ctx, IConfiguration config)
        {
            _context = ctx;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int userID)
        {
            var carts = await _context.Carts.Where(c => c.UserId == userID)
                .Select(c => new { c.UserId, c.ProductId, c.CartId, c.Quantity }).ToListAsync();
            var data = carts.Join(
                _context.Products,
                c => c.ProductId,
                p => p.ProductId,
                (c, p) => new { c.UserId, c.ProductId, c.CartId, c.Quantity, p.Title, p.Price, p.Image });

            if (data != null) return Ok(data);

            return NotFound();
        }

        [HttpGet("get-cart")]
        public async Task<IActionResult> GetCart()
        {
            string username = GetUserId();
            if (username == "") return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            int userID = user.UserId;

            var carts = await _context.Carts.Where(c => c.UserId == userID)
                .Select(c => new { c.UserId, c.ProductId, c.CartId, c.Quantity }).ToListAsync();

            var result = carts.Join(
                _context.Products,
                c => c.ProductId,
                p => p.ProductId,
                (c, p) => new { c.UserId, c.ProductId, c.CartId, c.Quantity, p.Title, p.Price, p.Image });

            if (result != null) return Ok(new { message = "success", result });

            return NotFound();
        }

        [HttpPost("{id}/add-to-cart")]
        public async Task<IActionResult> AddToCart(int id, [FromBody] Cart cart)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            string username = GetUserId();

            if (username == "") return Unauthorized();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            int userID = user.UserId;
            int productID = id;
            int quantity = (int)cart.Quantity;

            var cartOfUser = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userID && c.ProductId == productID);

            if (cartOfUser == null)
            {
                var cartItem = new Cart
                {
                    UserId = userID,
                    ProductId = productID,
                    Quantity = quantity
                };
                _context.Carts.Add(cartItem);
                await _context.SaveChangesAsync();

                int count = _context.Carts.Where(c => c.UserId == userID).Count();

                return Ok(new { message = "success", count });
            }
            else
            {
                var query = await _context.Carts.FirstOrDefaultAsync(c => c.CartId == cartOfUser.CartId);

                if (query == null) return NotFound();

                query.Quantity += quantity;
                _context.Carts.Update(query);
                await _context.SaveChangesAsync();

                int count = _context.Carts.Where(c => c.UserId == userID).Count();

                return Ok(new { message = "success", count });
            }
        }

        [HttpPost("update-quantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] Cart cart)       
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            string username = GetUserId();

            if (username == "") return Unauthorized();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            int userID = user.UserId;
            int cartID = cart.CartId;
            var cartOfUser = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userID && c.CartId == cartID);

            cartOfUser.Quantity = cart.Quantity;

            _context.Carts.Update(cartOfUser);
            await _context.SaveChangesAsync();

            var carts = await _context.Carts.Where(c => c.UserId == userID)
                .Select(c => new { c.UserId, c.ProductId, c.CartId, c.Quantity }).ToListAsync();

            var result = carts.Join(
                _context.Products,
                c => c.ProductId,
                p => p.ProductId,
                (c, p) => new { c.UserId, c.ProductId, c.CartId, c.Quantity, p.Title, p.Price, p.Image });

            return Ok(new { message = "successes", result });
        }

        [HttpDelete("delete-cart-item/{id}")]
        public async Task<IActionResult> DeleteCartItem(int id)
        {    
            string username = GetUserId();

            if (username == "") return Unauthorized();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            int userID = user.UserId;

            var cartItem = await _context.Carts.FindAsync(id);

            if (cartItem == null) return NotFound();

            _context.Carts.Remove(cartItem);
            await _context.SaveChangesAsync();

            var query = _context.Carts.Where(c => c.UserId == userID);
            int count = query.Count();

            var carts = query.Join(
                    _context.Products,
                    cart => cart.ProductId,
                    product => product.ProductId,
                    (cart, product) => new 
                    {   
                        cart.UserId, 
                        cart.CartId, 
                        cart.Quantity, 
                        product.Title, 
                        product.Price, 
                        product.Image 

                    }).ToList();

            return Ok(new { message = "success", carts, count });
        }

        private string GetUserId()
        {
            string token = HttpContext.Request.Headers["Authorization"];
            token = token.Substring(7);
            string secretKey = _config["Jwt:Key"];

            if (token == "undefined") return "";

            string username = VeryfiJWT.GetUsernameFromToken(token, secretKey);
            return username;
        }
    }
}
