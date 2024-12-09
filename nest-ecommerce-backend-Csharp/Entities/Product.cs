using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace back_end.Entities
{
    public partial class Product
    {
        public Product()
        {
            Carts = new HashSet<Cart>();
            OrderDetails = new HashSet<OrderDetail>();
        }

        public string Title { get; set; }
        public int? Price { get; set; }
        public string Detail { get; set; }
        public string Image { get; set; }
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public bool IsDeleted { get; set; }
        public int? Stock { get; set; }

        [JsonIgnore]
        public virtual Category Category { get; set; }
        public virtual ICollection<Cart> Carts { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
