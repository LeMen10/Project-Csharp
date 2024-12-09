using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace back_end.Entities
{
    public partial class Cart
    {
        public int? UserId { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }
        public int CartId { get; set; }
        public bool? IsDeleted { get; set; }

        public virtual Product Product { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }
    }
}
