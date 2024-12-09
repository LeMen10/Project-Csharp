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
    public class SiteController : ControllerBase
    {
        public readonly web_apiContext _context;
        private readonly IConfiguration _config;

        public SiteController(web_apiContext ctx, IConfiguration config)
        {
            _context = ctx;
            _config = config;
        }

        [HttpGet("get-address")]
        public async Task<IActionResult> GetAddressUser()
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            string username = GetUserId();

            if (username == "") return Unauthorized();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            int userID = user.UserId;

            var userResult = _context.Users.FirstOrDefault(u => u.UserId == userID);
            if (userResult.City == null) return Ok(new { message = "No Address" });
            return Ok(new { message = "success", userResult });

        }

        [HttpPost("update-address")]
        public async Task<IActionResult> UpdateAddress([FromBody] User user)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            string username = GetUserId();

            if (username == "") return Unauthorized();
            var userResult = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            int userID = userResult.UserId;

            if (userResult == null) return NotFound();

            userResult.Phone = user.Phone;
            userResult.City = user.City;
            userResult.District = user.District;
            userResult.Ward = user.Ward;
            userResult.SpecificAddress = user.SpecificAddress;
            userResult.FullName = user.FullName;

            _context.Users.Update(userResult);
            await _context.SaveChangesAsync();

            userResult = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userID);
            return Ok(new { message = "success" });
        }

        [HttpPost("search")]
        public IActionResult SearchProduct([FromQuery] string query, [FromQuery] int page, [FromQuery] int limit)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            int countSkip = (page - 1) * limit;
                
            var queryResult = _context.Products.Where(p => p.Title.Contains(query));

            double countProduct = queryResult.Count();
            countProduct = Math.Ceiling(countProduct / limit);

            var result = queryResult
                .OrderBy(x => 1)
                .Skip(countSkip)
                .Take(limit)
                .ToList();

            return Ok(new { message = "success", result , countProduct});
        }

        [HttpPost("product-checkout")]
        public async Task<IActionResult> ProductCheckout([FromBody] int[] dataIds)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            string username = GetUserId();

            if (username == "") return Unauthorized();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            int userID = user.UserId;

            var carts = _context.Carts.Where(item => dataIds.Contains(item.CartId)).ToList();
            if (carts == null) return NotFound();

            var result = carts.Join(
                _context.Products,
                c => c.ProductId,
                p => p.ProductId,
                (c, p) => new { c.UserId, c.ProductId, c.CartId, c.Quantity, p.Title, p.Price, p.Image });

            return Ok(new { message = "success", result });
        }

        [HttpPost("save-order")]
        public async Task<IActionResult> SaveOrder([FromBody] Entities.Order order)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                string username = GetUserId();

                if (username == "") return Unauthorized();
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                int userID = user.UserId;

                string payment = order.Payment;

                var newOrder = new Entities.Order
                {
                    UserId = userID,
                    Payment = payment,
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                int OrderId = newOrder.OrderId;

                if (order.OrderDetails != null && order.OrderDetails.Any())
                {
                    var orderDetails = order.OrderDetails.Select(od => new OrderDetail
                    {
                        OrderId = OrderId,
                        ProductId = od.ProductId,
                        Quantity = od.Quantity,
                        Status = od.Status,
                        PaymentStatus = od.PaymentStatus,
                        Total = od.Total
                    });

                    foreach (var orderDetail in orderDetails)
                    {
                        if (orderDetail.PaymentStatus.Equals("Đã thanh toán")) continue;
                        int productId = orderDetail.ProductId;
                        Product product = _context.Products.FindAsync(productId).Result;
                        product.Stock -= orderDetail.Quantity;
                    }

                    _context.OrderDetails.AddRange(orderDetails);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "success", OrderId });
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException?.Message ?? ex.Message;
                return BadRequest(new { message = $"Error: {innerException}" });
            }

        }

        [HttpPost("update-payment-status")]
        public async Task<IActionResult> UpdatePaymentStatus([FromQuery] int orderID, [FromQuery] string paymentStatus)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var orderDetails = await _context.OrderDetails
                    .Where(od => od.OrderId == orderID)
                    .ToListAsync();

                if (orderDetails == null || !orderDetails.Any())
                {
                    return NotFound(new { message = "Không tìm thấy OrderDetails" });
                }

                foreach (var orderDetail in orderDetails)
                {
                    if (orderDetail.PaymentStatus.Equals("Đã thanh toán")) continue;
                    int productId = orderDetail.ProductId;
                    Product product = _context.Products.FindAsync(productId).Result;
                    product.Stock -= orderDetail.Quantity;

                    orderDetail.PaymentStatus = paymentStatus;
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "success" });
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException?.Message ?? ex.Message;
                return BadRequest(new { message = $"Error: {innerException}" });
            }
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
