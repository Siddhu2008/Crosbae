const products = [
  {
    id: "1",
    productName: "Elegant Diamond Necklace",
    name: "Diamond Necklace",
    description: "An elegant necklace crafted with the finest diamonds and 18KT gold.",
    price: 85000,
    category: "Diamond",
    purity: "18KT",
    occasion: "Anniversary",
    tags: ["Best Seller", "NEW"],
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_5-pOX_tXH7pVf_6s0tyD5MnZ0YZmTvwTg&s",
      "https://www.foreverjewelsindia.com/cdn/shop/files/rn-image_picker_lib_temp_b186ade9-9aab-45f6-b810-ed47f48c26a8.jpg?v=1727336455",
      "https://www.soosi.co.in/cdn/shop/products/WhatsAppImage2021-07-24at23.49.59_2048x.jpg?v=1627190767",
      "https://www.soosi.co.in/cdn/shop/products/WhatsAppImage2021-07-24at23.47.49_2_1200x1200.jpg?v=1627190767",
    ],
    date: "2025-08-20",
    rating: 4.8,
    company: "Gemstone Traders",
    origin: "India",
    reviews: [
      {
        name: "Aarti Shah",
        rating: 5,
        comment: "Absolutely stunning piece, worth every penny!",
        date: "2025-08-22"
      },
      {
        name: "Rohit Mehta",
        rating: 4,
        comment: "Great quality but packaging could be better.",
        date: "2025-08-23"
      }
    ]
  },
  {
    id: "2",
    productName: "Classic Gold Bangle",
    name: "Gold Bangle",
    description: "Traditional 22KT gold bangle perfect for weddings and festive occasions.",
    price: 42000,
    category: "Gold",
    purity: "22KT",
    occasion: "Wedding",
    tags: ["Flat 50% OFF"],
    images: [
      "https://i.pinimg.com/736x/11/82/fa/1182fa5e7e9827d208ec3344fbae7ab5.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmYF6vxDDXztj4skjcoBcP9UKlS0VnFaymBA&s",
      "https://www.tanishq.ae/dw/image/v2/BJGM_PRD/on/demandware.static/-/Sites-Tanishq-site-catalog/default/dwfba6b370/images/hi-res/UPD5B1VMH2A00_2.jpg?sw=360&sh=360&sm=fit",
      "https://khazanajewellery.b-cdn.net/media/catalog/product/cache/87523d35865f5cc18e4614506cef2cdf/1/0/107t0425b16480t091601102100_av.jpg",
    ],
    date: "2025-08-15",
    rating: 4.6,
    company: "Heritage Gold",
    origin: "India",
    reviews: [
      {
        name: "Priya Verma",
        rating: 5,
        comment: "Perfect for my sister's wedding. Loved the shine.",
        date: "2025-08-17"
      }
    ]
  },
  {
    id: "3",
    productName: "Sterling Silver Pendant",
    name: "Silver Pendant",
    description: "Modern 925 sterling silver pendant with a sleek design.",
    price: 3200,
    category: "Silver",
    purity: "925",
    occasion: "Daily Wear",
    tags: ["NEW"],
    images: [
      "https://d2ma7w4w9grdob.cloudfront.net/media/45100-IND_2930.JPG",
      "https://d2ma7w4w9grdob.cloudfront.net/media/450X450-45637IND_3012.JPG?ver=1.7",
      "https://www.truesilver.co.in/cdn/shop/files/NK123385S18IAT_600x.jpg?v=1744870760",
      "https://d2ma7w4w9grdob.cloudfront.net/media/450X450-45656IND_3008.JPG?ver=1.7",
    ],
    date: "2025-07-28",
    rating: 4.3,
    company: "Silver Style",
    origin: "Thailand",
    reviews: [
      {
        name: "Neha Joshi",
        rating: 4,
        comment: "Simple and elegant. Matches my daily look.",
        date: "2025-07-30"
      }
    ]
  },
  {
    id: "4",
    productName: "Platinum Wedding Band",
    name: "Platinum Band",
    description: "Timeless PT950 platinum wedding band with a smooth finish.",
    price: 67000,
    category: "Platinum",
    purity: "PT950",
    occasion: "Engagement",
    tags: ["Best Seller"],
    images: [
      "https://www.patiencejewellery.com/cdn/shop/articles/Moira_Patience_Fine_Jewellery_Bespoke_Commission_Hand_Engraved_Platinum_Wedding_Rings_1.jpg?v=1555446210",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlj7fp6annE7x9QAVdG-Cta5gr43IM7VhrmNH-WV104qN2SnLQz5vxD2ijwkhFgLrmB7s&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTngtnR92xbHY-szY57hMJhB8liRDerFYYdla1ojOrqK2LZjfVqcsfNJQOy3p7Ocu5EgUk&usqp=CAU",
    ],
    date: "2025-06-30",
    rating: 4.9,
    company: "Pure Platinum Co.",
    origin: "USA",
    reviews: [
      {
        name: "Sameer Khan",
        rating: 5,
        comment: "Bought this for my engagement. Amazing design!",
        date: "2025-07-02"
      }
    ]
  },
  {
    id: "5",
    productName: "Floral Diamond Ring",
    name: "Diamond Ring",
    description: "A floral-inspired ring with sparkling diamonds set in 18KT gold.",
    price: 38000,
    category: "Diamond",
    purity: "18KT",
    occasion: "Party",
    tags: [],
    images: [
      "https://i.etsystatic.com/17565120/r/il/4acf43/4507542620/il_fullxfull.4507542620_eh7b.jpg",
      "https://www.wallacebishop.com.au/cdn/shop/files/round-brilliant-cut-diamond-flower-ring-in-9ct-yellow-gold-tdw-0-50ct-wallace-bishop-2.png?v=1689664751",
      "https://www.orra.co.in/media/catalog/product/o/r/org22019_1_m2xicjnhbgtdbr3r.jpg",
      "https://www.orra.co.in/media/catalog/product/o/r/org22019_2_m2xicjnhbgtdbr3r.jpg",
    ],
    date: "2025-07-15",
    rating: 4.5,
    company: "Ornate Jewels",
    origin: "India",
    reviews: [
      {
        name: "Aman Patel",
        rating: 4,
        comment: "Looks exactly like the photo. Good quality.",
        date: "2025-07-16"
      }
    ]
  },
  {
    id: "6",
    productName: "Modern Gold Chain",
    name: "Gold Chain",
    description: "Stylish and sleek 22KT gold chain for modern everyday wear.",
    price: 25500,
    category: "Gold",
    purity: "22KT",
    occasion: "Daily Wear",
    tags: ["NEW"],
    images: [
      "https://5.imimg.com/data5/SELLER/Default/2023/11/360900709/DE/NT/YL/126905987/imitation-bangles-2-500x500.jpeg",
      "https://5.imimg.com/data5/SELLER/Default/2023/11/360900709/DE/NT/YL/126905987/imitation-bangles-2-500x500.jpeg",
      "https://5.imimg.com/data5/SELLER/Default/2023/11/360900707/AT/HM/EM/126905987/imitation-bangles-1-500x500.jpeg",
      "https://5.imimg.com/data5/SELLER/Default/2023/11/360900707/AT/HM/EM/126905987/imitation-bangles-1-500x500.jpeg",

    ],
    date: "2025-08-01",
    rating: 4.2,
    company: "GoldLine",
    origin: "India",
    reviews: [
      {
        name: "Vikas Singh",
        rating: 4,
        comment: "Good for gifting. Fast delivery too.",
        date: "2025-08-03"
      }
    ]
  },
  {
    id: "7",
    productName: "925 Silver Toe Ring",
    name: "Silver Toe Ring",
    description: "Minimalist toe ring crafted in 925 sterling silver.",
    price: 850,
    category: "Silver",
    purity: "925",
    occasion: "Festive",
    tags: [],
    images: [
      "https://silvernestmysore.com/wp-content/uploads/2023/03/TR13-2.jpg",
      "https://silvernestmysore.com/wp-content/uploads/2023/03/TR13-2.jpg",
      "https://thekojewelleryshop.com/cdn/shop/products/IMG_8530_3bef409d-27dc-4648-a50b-f028280c0344.jpg?v=1672392381",
      "https://thekojewelleryshop.com/cdn/shop/products/IMG_8530_3bef409d-27dc-4648-a50b-f028280c0344.jpg?v=1672392381",
    ],
    date: "2025-07-25",
    rating: 4.0,
    company: "Silver Touch",
    origin: "India",
    reviews: [
      {
        name: "Meena Kapoor",
        rating: 4,
        comment: "Nice and affordable.",
        date: "2025-07-27"
      }
    ]
  },
  {
    id: "8",
    productName: "Dual Tone Platinum Ring",
    name: "Platinum Ring",
    description: "Unique dual-tone PT950 ring with sleek gold accents.",
    price: 72000,
    category: "Platinum",
    purity: "PT950",
    occasion: "Anniversary",
    tags: ["NEW"],
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE3wcZqBV-peRBOGsFfcvZZeaGOA9NYlLXXg&s",
      "https://cdn.augrav.com/online/jewels/2021/03/27121353/Dual-Tone-Platinum-Ring.jpg",
      "https://www.patiencejewellery.com/cdn/shop/products/Moira_Patience_Fine_Jewellery_Bespoke_Commission_Hand_Engraved_Platinum_Wedding_Rings_3.jpg?v=1555446210",
      "https://www.patiencejewellery.com/cdn/shop/products/Moira_Patience_Fine_Jewellery_Bespoke_Commission_Hand_Engraved_Platinum_Wedding_Rings_2.jpg?v=1555446210",
    ],
    date: "2025-08-10",
    rating: 4.7,
    company: "Platinum World",
    origin: "Germany",
    reviews: [
      {
        name: "Nikita Sharma",
        rating: 5,
        comment: "Stylish and luxurious. My husband loved it.",
        date: "2025-08-11"
      }
    ]
  },
  {
    id: "9",
    productName: "Heart-Shaped Diamond Pendant",
    name: "Diamond Pendant",
    description: "Heart-shaped pendant studded with diamonds and set in 18KT white gold.",
    price: 29500,
    category: "Diamond",
    purity: "18KT",
    occasion: "Engagement",
    tags: ["Flat 50% OFF"],
    images: [
      "https://cdn.caratlane.com/media/catalog/product/S/P/SP00019-YGP900_1_lar.jpg",
      "https://d322s37z6qhrgo.cloudfront.net/wp-content/uploads/2024/05/WPE0886-frontYG.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhAK-42sM_bgbJdjJjsqOVV8bZi8PHfQpqaXrglVwjdBviiY3rWbTspMwXMuo6StKuGQA&usqp=CAU",
      "https://cdn.caratlane.com/media/catalog/product/S/P/SP00019-YGP900_1_lar.jpg",
    ],
    date: "2025-08-18",
    rating: 4.4,
    company: "Dazzle Co.",
    origin: "USA",
    reviews: [
      {
        name: "Ritika Nair",
        rating: 5,
        comment: "Gorgeous! Gave it as a gift and she loved it.",
        date: "2025-08-19"
      }
    ]
  },
  {
    id: "10",
    productName: "Traditional Gold Earrings",
    name: "Gold Earrings",
    description: "22KT gold earrings with traditional motifs and fine craftsmanship.",
    price: 18500,
    category: "Gold",
    purity: "22KT",
    occasion: "Festive",
    tags: ["Best Seller"],
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2fKyo4RQCy-uha4Ld3Mbl4BsxSxrUUG5WiA&s",
      "https://www.dazzlesjewellery.in/cdn/shop/files/IMG_0448_f6990acc-6d0a-4f2a-825c-e4257cbba46e.jpg?v=1719298484",
      "https://www.dazzlesjewellery.in/cdn/shop/files/IMG_0450_1a3f3f6c-4f7e-4d0c-8f7b-4e2f5e5e6c8b.jpg?v=1719298484",
      "https://www.tanishq.ae/dw/image/v2/BJGM_PRD/on/demandware.static/-/Sites-Tanishq-site-catalog/default/dw9e3e3d1c/images/hi-res/UPD5B1VMH2A00_2.jpg?sw=360&sh=360&sm=fit",
    ],
    date: "2025-08-05",
    rating: 4.6,
    company: "Royal Golds",
    origin: "India",
    reviews: [
      {
        name: "Suman Jain",
        rating: 4,
        comment: "Very pretty and matches perfectly with Indian outfits.",
        date: "2025-08-06"
      }
    ]
  }
];

export default products;
