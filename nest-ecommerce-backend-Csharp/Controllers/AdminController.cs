using back_end.Entities;
using back_end.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BC = BCrypt.Net.BCrypt;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        public readonly web_apiContext _context;
        private readonly IConfiguration _config;

        public AdminController(web_apiContext ctx, IConfiguration config)
        {
            _context = ctx;
            _config = config;
        }

        [HttpGet("get-products")]
        public IActionResult GetProduct([FromQuery] int page, [FromQuery] int limit)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            int countSkip = (page - 1) * limit;
            var products = _context.Products.Where(product => product.IsDeleted != true)
                .Join(
                    _context.Categories,
                    product => product.CategoryId,
                    category => category.CategoryId,
                    (product, category) => new {
                        product.Title,
                        product.Image,
                        product.Price,
                        product.ProductId,
                        category.Cate
                    }
                )
                .Select(p => new { p.Title, p.Image, p.Price, p.ProductId, p.Cate })
                .Skip(countSkip).Take(limit).ToList();

            double count = _context.Products.Count(product => !product.IsDeleted);
            var countProduct = Math.Ceiling(count / limit);

            return Ok(new { message = "success", products, countProduct });
        }

        [HttpPost("add-product")]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var addProduct = new Product
            {
                Title = product.Title,
                Price = product.Price,
                Detail = product.Detail,
                CategoryId = product.CategoryId,
                Image = "http://localhost:13395/image/" + product.Image,
            };

            _context.Products.Add(addProduct);
            await _context.SaveChangesAsync();
            var cate = await _context.Categories.FindAsync(product.CategoryId);
            if (cate == null) return NotFound();

            cate.Count += 1;
            _context.Categories.Update(cate);
            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });
        }

        [HttpDelete("delete-product/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            product.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });
        }

        [HttpGet("find-product/{id}")]
        public IActionResult FindProduct(int id)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var product = _context.Products.Where(p => p.ProductId == id)
                .Join(
                    _context.Categories,
                    p => p.CategoryId,
                    c => c.CategoryId,
                    (p, c) => new { c.CategoryId, c.Cate, p.Detail, p.Image, p.Title, p.Price, p.ProductId }
                );

            if (product == null) return NotFound();

            return Ok(new { message = "success", product });
        }

        [HttpPut("edit-product/{id}")]
        public async Task<IActionResult> EditProduct(int id, [FromBody] Product updatedProduct)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null) return NotFound();

            var cate = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == updatedProduct.CategoryId);
            if (cate == null) return NotFound();

            product.Title = updatedProduct.Title;
            product.Price = updatedProduct.Price;
            product.CategoryId = updatedProduct.CategoryId;
            product.Detail = updatedProduct.Detail;
            product.Image = "http://localhost:13395/image/" + updatedProduct.Image;


            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });
        }

        [HttpGet("trash-products")]
        public IActionResult TrashProduct([FromQuery] int page, [FromQuery] int limit)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();
            var query = _context.Products
                .Where(p => p.IsDeleted != false)
                .Join(
                    _context.Categories,
                    product => product.CategoryId,
                    category => category.CategoryId,
                    (product, category) => new {
                        product.Title,
                        product.Image,
                        product.Price,
                        product.ProductId,
                        category.Cate
                    }
                )
                .Select(p => new { p.Title, p.Image, p.Price, p.ProductId, p.Cate });

            int countSkip = (page - 1) * limit;
            var products = query.Skip(countSkip).Take(limit).ToList();

            double count = query.Count();
            var countProduct = Math.Ceiling(count / limit);

            return Ok(new { message = "success", products, countProduct });
        }

        [HttpPut("restore-product/{id}")]
        public async Task<IActionResult> RestoreProduct(int id)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null) return NotFound();

            product.IsDeleted = false;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });
        }

        [HttpGet("get-count-product-deleted")]
        public IActionResult GetNumberProductDeleted()
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var count = _context.Products.Where(u => u.IsDeleted == true).Count();

            return Ok(new { message = "success", count });
        }

        [HttpDelete("delete-multiple-products")]
        public async Task<IActionResult> DeleteMultipleProducts([FromBody] int[] dataIds)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var products = _context.Products.Where(item => dataIds.Contains(item.ProductId)).ToList();

            foreach (var product in products)
            {
                product.IsDeleted = true;
            };

            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });
        }

        [HttpPut("restore-multiple-products")]
        public async Task<IActionResult> RestoreMultipleProduct([FromBody] int[] dataIds)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var products = _context.Products.Where(item => dataIds.Contains(item.ProductId)).ToList();

            foreach (var product in products)
            {
                product.IsDeleted = false;
            };

            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });
        }


        [HttpGet("get-orders")]
        public IActionResult GetOrders([FromQuery] int page, [FromQuery] int limit)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var query = _context.Orders
                .Join(
                     _context.OrderDetails,
                     order => order.OrderId,
                     orderDetail => orderDetail.OrderId,
                     (order, orderDetail) => new {
                         Order = order,
                         OrderDetail = orderDetail
                     }
                )
                .Join(
                    _context.Users,
                    result => result.Order.UserId,
                    user => user.UserId,
                    (result, user) => new
                    {
                        result.OrderDetail.OrderDetailId,
                        result.OrderDetail.Status,
                        result.OrderDetail.Total,
                        result.OrderDetail.PaymentStatus,
                        result.Order.CreateDate,
                        user.FullName
                    }
                )
                .Select(rs => new
                {
                    rs.OrderDetailId,
                    rs.Status,
                    rs.Total,
                    rs.PaymentStatus,
                    CreateDate = rs.CreateDate.ToString("yyyy-MM-dd"), // Chỉ lấy phần ngày
                    rs.FullName
                });

            int countSkip = (page - 1) * limit;
            var orderDetails = query.Skip(countSkip).Take(limit).ToList();

            double count = query.Count();
            var countProduct = Math.Ceiling(count / limit);

            return Ok(new { message = "success", orderDetails, countProduct });
        }

        [HttpPut("update-status-order/{orderDetailId}")]
        public async Task<IActionResult> UpdateStatusOrder(int orderDetailId, [FromBody] OrderDetail orderDetail)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var query = await _context.OrderDetails.FirstOrDefaultAsync(or => or.OrderDetailId == orderDetailId);

            if (query == null) return NotFound();
            if (orderDetail.Status == "Hoàn thành") query.PaymentStatus = "Đã thanh toán";
            query.Status = orderDetail.Status;

            _context.OrderDetails.Update(query);
            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });

        }

        [HttpGet("get-number-order")]
        public IActionResult GetNumberOrder()
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var all = _context.OrderDetails.Count();
            var processing = _context.OrderDetails.Where(or => or.Status == "Đang xử lý").Count();
            var delivering = _context.OrderDetails.Where(or => or.Status == "Đang giao").Count();
            var complete = _context.OrderDetails.Where(or => or.Status == "Hoàn thành").Count();
            return Ok(new { message = "success", all, processing, delivering, complete });
        }

        [HttpGet("order-statistics")]
        public IActionResult OrderStatistics()
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            List<int> allMonths = Enumerable.Range(1, 12).ToList();

            // Lấy số lượng chi tiết đơn hàng theo từng tháng từ cơ sở dữ liệu
            var orderDetailCounts = _context.OrderDetails
                .Where(od => od.Order.CreateDate.Year == 2024)
                .GroupBy(od => new { od.Order.CreateDate.Year, od.Order.CreateDate.Month })
                .Select(group => new
                {
                    Year = group.Key.Year,
                    Month = group.Key.Month,
                    OrderDetailCount = group.Count()
                })
                .OrderBy(result => result.Year)
                .ThenBy(result => result.Month)
                .ToList();


            // Tạo mảng để lưu trữ thông tin
            List<int> months = new();
            List<int> orderDetailCountsPerMonth = new();

            foreach (var month in allMonths)
            {
                // Kiểm tra xem tháng có trong kết quả từ cơ sở dữ liệu không
                var resultForMonth = orderDetailCounts.FirstOrDefault(x => x.Month == month);

                // Nếu tháng không có trong kết quả, thì số lượng chi tiết đơn hàng là 0
                int orderDetailCount = resultForMonth?.OrderDetailCount ?? 0;

                // Thêm thông tin vào mảng
                months.Add(month);
                orderDetailCountsPerMonth.Add(orderDetailCount);
            }

            return Ok(new { message = "success", months, orderDetailCountsPerMonth });
        }



        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var checkUser = _context.Users.SingleOrDefault(u => u.Username == user.Username);
            if (checkUser == null || !string.Equals(checkUser.Role, "admin", StringComparison.OrdinalIgnoreCase)) return NotFound();

            var key = _config["Jwt:Key"];
            var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var signinCredential = new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, checkUser.Username),
                new Claim(ClaimTypes.Role, checkUser.Role),
            };

            //tao token
            var tokenSetUp = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                expires: DateTime.Now.AddDays(1),
                signingCredentials: signinCredential,
                claims: claims
            );

            //sinh ra token với các thông số ở trên
            var accessToken = new JwtSecurityTokenHandler().WriteToken(tokenSetUp);

            // Trả về kết quả thành công
            return Ok(new { message = "success", accessToken, checkUser });
        }

        [HttpGet("get-users")]
        public IActionResult GetUsers([FromQuery] int page, [FromQuery] int limit)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            int countSkip = (page - 1) * limit;
            var users = _context.Users.Where(u => u.IsDeleted == false).OrderBy(x => 1).Skip(countSkip).Take(limit).ToList();

            double count = _context.Users.Count();
            var countUser = Math.Ceiling(count / limit);

            return Ok(new { message = "success", users, countUser });
        }

        [HttpGet("find-user/{id}")]
        public IActionResult FindUser(int id)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var user = _context.Users.Where(u => u.UserId == id).ToList();
            if (user == null) return NotFound();

            return Ok(new { message = "success", user });
        }

        [HttpPut("restore-user/{id}")]
        public async Task<IActionResult> RestoreUser(int id)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null) return NotFound();
            user.IsDeleted = false;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            var users = _context.Users.Where(u => u.IsDeleted == true).ToList();
            return Ok(new { message = "success", users });
        }

        [HttpPut("edit-user/{id}")]
        public async Task<IActionResult> EditUser(int id, [FromBody] User updatedUser)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var findUser = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);

            if (findUser == null) return NotFound();


            findUser.Username = updatedUser.Username;
            findUser.FullName = updatedUser.FullName;
            findUser.Phone = updatedUser.Phone;
            findUser.Email = updatedUser.Email;
            findUser.Role = updatedUser.Role;
            findUser.City = updatedUser.City;
            findUser.District = updatedUser.District;
            findUser.Ward = updatedUser.Ward;
            findUser.SpecificAddress = updatedUser.SpecificAddress;
            
            _context.Users.Update(findUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });
        }

        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var user = await _context.Users.FindAsync(id);

            if (user == null) return NotFound();

            user.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });
        }

        [HttpDelete("delete-multiple-users")]
        public async Task<IActionResult> DeleteMultipleUsers([FromBody] int[] dataIds)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var users = _context.Users.Where(item => dataIds.Contains(item.UserId)).ToList();

            foreach (var user in users)
            {
                user.IsDeleted = true;
            };

            await _context.SaveChangesAsync();
            return Ok(new { message = "success" });
        }

        [HttpPut("restore-multiple-users")]
        public async Task<IActionResult> RestoreMultipleUser([FromBody] int[] dataIds)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var users = _context.Users.Where(item => dataIds.Contains(item.UserId)).ToList();

            foreach (var user in users)
            {
                user.IsDeleted = false;
            };

            await _context.SaveChangesAsync();

            return Ok(new { message = "success" });
        }

        [HttpGet("trash-users")]
        public IActionResult TrashUsers([FromQuery] int page, [FromQuery] int limit)
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var query = _context.Users.Where(p => p.IsDeleted == true).ToList();

            int countSkip = (page - 1) * limit;
            var users = query.Skip(countSkip).Take(limit).ToList();

            double count = query.Count;
            var countUser = Math.Ceiling(count / limit);

            return Ok(new { message = "success", users, countUser });
        }

        [HttpGet("get-count-user-deleted")]
        public IActionResult GetNumberUserDeleted()
        {
            string role = GetUserRole();
            if (role == "" || role != "admin") return Unauthorized();

            var count = _context.Users.Where(u => u.IsDeleted == true).Count();

            return Ok(new { message = "success", count });
        }

        private string GetUserRole()
        {
            string token = HttpContext.Request.Headers["Authorization"];
            if (token == null) return "";

            token = token.Substring(7);
            string secretKey = _config["Jwt:Key"];

            if (token == "undefined") return "";

            string role = VeryfiJWT.GetRoleFromToken(token, secretKey);
            return role;
        }
    }
}
