using System;
using System.Collections.Generic;

#nullable disable

namespace back_end.Entities
{
    public partial class Category
    {
        public Category()
        {
            Products = new HashSet<Product>();
        }

        public int? Count { get; set; }
        public string Image { get; set; }
        public string Cate { get; set; }
        public string Title { get; set; }
        public int CategoryId { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}
