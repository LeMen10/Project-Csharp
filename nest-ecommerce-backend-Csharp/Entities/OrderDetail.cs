using System;
using System.Collections.Generic;

#nullable disable

namespace back_end.Entities
{
    public partial class OrderDetail
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int? Quantity { get; set; }
        public string Status { get; set; }
        public int? Total { get; set; }
        public int OrderDetailId { get; set; }
        public string PaymentStatus { get; set; }
        public bool? IsDeleted { get; set; }

        public virtual Order Order { get; set; }
        public virtual Product Product { get; set; }
    }
}
