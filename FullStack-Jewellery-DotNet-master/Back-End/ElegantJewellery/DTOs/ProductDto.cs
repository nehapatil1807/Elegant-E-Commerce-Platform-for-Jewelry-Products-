﻿namespace ElegantJewellery.DTOs
{
    public class ProductDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }

        public string ImageUrl { get; set; }
        public int CategoryId { get; set; }
    }
}
