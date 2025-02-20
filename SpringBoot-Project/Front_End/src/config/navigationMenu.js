export const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "Neckles",
          href: "/",
          imageSrc: "https://cdn.bradojewellery.com/p/540x/1725358098940.jpeg",
          imageAlt:
            "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Jhumka",
          href: "/",
          imageSrc: "https://cdn.bradojewellery.com/p/540x/1719922648757.jpeg",
          imageAlt: "Traditional Jhumka",
        },
      ],
      sections: [
        {
          id: "rings",
          name: "Rings",
          items: [
            { name: "Engagement", id: "engagment", href: `{women/rings/engagement}` },
            {
              name: "Platinum",
              id: "platinum",
              href: `{women/rings/platinum}`,
            },
            {
              name: "Adjustable Rings",
              id: "adjustable_rings",
              href: `{women/rings/adjustable_rings}`,
            },
            {
              name: "Solitaire",
              id: "solitaire",
              href: `{women/rings/solitaire}`,
            },
          ],
        },
        {
          id: "earrings",
          name: "Earrings",
          items: [
            { name: "Studs", id: "studs", href: `{women/earrings/studs}` },
            { name: "Jhumka", id: "jhumka", href: `{women/earrings/jhumka}` },
            {
              name: "Pearl Earrings",
              id: "pearl_earrings",
              href: `{women/earrings/pearl_earrings}`,
            },
            { name: "Drops", id: "drops", href: `{women/earrings/drops}` },
          ],
        },
        {
          id: "neckles_brands",
          name: "Neckles Brands",
          items: [
            {
              name: "Coast Diamond",
              id: "coast_diamond",
              href: `{women/neckles_brands/coast_diamond}`,
            },
            {
              name: "Spark Creations",
              id: "spark_creations",
              href: `{women/neckles_brands/spark_creations}`,
            },
            {
              name: "Stanton Color",
              id: "stanton_color",
              href: `{women/neckles_brands/stanton_color}`,
            },
            { name: "Mira", id: "mira", href: `{women/neckles_brands/mira}` },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Men",
      featured: [
        {
          name: "Stylish Bracelet",
          id: "#",
          imageSrc: "https://cdn.bradojewellery.com/p/540x/1691474904869.jpeg",
          imageAlt: "Stylish Bracelet",
        },
        {
          name: "Miniature Bracelet",
          href: "#",
          imageSrc: "https://cdn.bradojewellery.com/p/540x/1691471258527.jpeg",
          imageAlt: "Crafted by craftmens with love & passsion",
        },
      ],
      sections: [
        {
          id: "bracelets",
          name: "Bracelets",
          items: [
            { name: "Silver", id: "silver", href: `{men/bracelets/silver}` },
            { name: "Gold", id: "gold", href: `{men/bracelets/gold}` },
            {
              name: "Platinum",
              id: "platinum",
              href: `{men/bracelets/platinum}`,
            },
            { name: "Diamond", id: "diamond", href: `{men/bracelets/diamond}` },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            {
              name: "Golden Watches",
              id: "golden_watches",
              href: `{men/accessories/silver}`,
            },
            { name: "Rings", id: "rings", href: `{men/accessories/rings}` },
            {
              name: "Lockets",
              id: "lockets",
              href: `{men/accessories/lockets}`,
            },
            {
              name: "Diamond Belts",
              id: "diamond_belts",
              href: `{men/accessories/diamond_belts}`,
            },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            {
              name: "Coast Diamond",
              id: "coast_diamond",
              href: `{men/brands/coast_diamond}`,
            },
            {
              name: "Spark Creations",
              id: "spark_creations",
              href: `{men/brands/spark_creations}`,
            },
            {
              name: "Stanton Color",
              id: "stanton_color",
              href: `{men/brands/stanton_color}`,
            },
            { name: "Royal", id: "royal", href: `{men/brands/royal}` },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "About Us", href: "/about-us" },
    { name: "Stores", href: "/stores" },
  ],
};
