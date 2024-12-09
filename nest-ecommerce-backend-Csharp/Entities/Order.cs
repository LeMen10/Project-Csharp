using System;
using System.Collections.Generic;

#nullable disable

namespace back_end.Entities
{
    public partial class Order
    {
        public Order()
        {
            OrderDetails = new HashSet<OrderDetail>();
        }

        public int? UserId { get; set; }
        public string Payment { get; set; }
        public int OrderId { get; set; }
        public DateTime CreateDate { get; set; }
        public bool? IsDeleted { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
