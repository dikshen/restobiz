import type {
  Category,
  Coupon,
  LiveOrder,
  MenuItem,
  Restaurant,
  RestaurantTable,
  StaffUser,
} from "@/types";

// Multi-tenant mock data. Every collection below holds rows for MULTIPLE
// restaurants, each tagged with its owning restaurantId — exactly how the
// real Supabase tables will look once wired up. There are TWO demo
// restaurants here (not one) specifically so the scoping logic can be
// verified: querying restaurant A must never surface restaurant B's rows.
//
// All "getXForRestaurant(restaurantId)" functions below are the only
// functions that filter by restaurantId — they run once, in
// RestaurantScopeLayout, when a slug is resolved. Everything else in the
// app (pages, components, cart) only ever touches the already-scoped
// arrays it's handed — never restaurantId directly.

export const restaurants: Restaurant[] = [
  {
    id: "rest_001",
    slug: "spice-route",
    name: "Spice Route Kitchen",
    logoUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&auto=format",
    coverUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop&auto=format",
    cuisines: ["North Indian", "Mughlai", "Tandoor"],
    gstPercent: 5,
    serviceChargePercent: 5,
    currency: "INR",
  },
  {
    id: "rest_002",
    slug: "bombay-brew-cafe",
    name: "Bombay Brew Café",
    logoUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=200&fit=crop&auto=format",
    coverUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=400&fit=crop&auto=format",
    cuisines: ["Café", "Continental", "Beverages"],
    gstPercent: 5,
    serviceChargePercent: 0,
    currency: "INR",
  },
];

export const tables: RestaurantTable[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `rest_001_table_${i + 1}`,
    restaurantId: "rest_001",
    number: i + 1,
    label: `Table ${i + 1}`,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `rest_002_table_${i + 1}`,
    restaurantId: "rest_002",
    number: i + 1,
    label: `Table ${i + 1}`,
  })),
];

export const categories: Category[] = [
  { id: "cat_starters", restaurantId: "rest_001", name: "Starters", sortOrder: 1 },
  { id: "cat_mains", restaurantId: "rest_001", name: "Mains", sortOrder: 2 },
  { id: "cat_breads", restaurantId: "rest_001", name: "Breads", sortOrder: 3 },
  { id: "cat_rice", restaurantId: "rest_001", name: "Rice & Biryani", sortOrder: 4 },
  { id: "cat_desserts", restaurantId: "rest_001", name: "Desserts", sortOrder: 5 },
  { id: "cat_beverages", restaurantId: "rest_001", name: "Beverages", sortOrder: 6 },

  { id: "cat_bb_coffee", restaurantId: "rest_002", name: "Coffee", sortOrder: 1 },
  { id: "cat_bb_bakes", restaurantId: "rest_002", name: "Bakes", sortOrder: 2 },
  { id: "cat_bb_allday", restaurantId: "rest_002", name: "All-Day Breakfast", sortOrder: 3 },
];

export const menuItems: MenuItem[] = [
  {
    id: "item_001",
    restaurantId: "rest_001",
    categoryId: "cat_starters",
    name: "Paneer Tikka",
    description:
      "Char-grilled cottage cheese marinated in hung curd, ginger-garlic and smoked spices, served with mint chutney.",
    price: 289,
    imageUrl:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: true,
    spiceLevel: 2,
    rating: 4.6,
    ratingCount: 214,
    prepTimeMinutes: 18,
    ingredients: ["Paneer", "Hung curd", "Bell pepper", "Onion", "Kashmiri chilli", "Mustard oil"],
    isAvailable: true,
  },
  {
    id: "item_002",
    restaurantId: "rest_001",
    categoryId: "cat_starters",
    name: "Chicken 65",
    description: "Deep-fried curry leaf and byadgi chilli chicken, tossed in a tangy South Indian glaze.",
    price: 319,
    imageUrl:
      "https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?w=600&h=450&fit=crop&auto=format",
    isVeg: false,
    isBestSeller: true,
    spiceLevel: 3,
    rating: 4.7,
    ratingCount: 341,
    prepTimeMinutes: 20,
    ingredients: ["Chicken", "Curry leaves", "Byadgi chilli", "Curd", "Rice flour"],
    isAvailable: true,
  },
  {
    id: "item_003",
    restaurantId: "rest_001",
    categoryId: "cat_starters",
    name: "Hara Bhara Kebab",
    description: "Spinach and green pea patties studded with cashew, pan-seared to a crisp crust.",
    price: 249,
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: false,
    spiceLevel: 1,
    rating: 4.3,
    ratingCount: 98,
    prepTimeMinutes: 15,
    ingredients: ["Spinach", "Green peas", "Potato", "Cashew", "Chaat masala"],
    isAvailable: true,
  },
  {
    id: "item_004",
    restaurantId: "rest_001",
    categoryId: "cat_mains",
    name: "Butter Chicken",
    description: "Tandoor-roasted chicken simmered in a velvety tomato-butter gravy, finished with cream.",
    price: 389,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=450&fit=crop&auto=format",
    isVeg: false,
    isBestSeller: true,
    spiceLevel: 1,
    rating: 4.8,
    ratingCount: 512,
    prepTimeMinutes: 22,
    ingredients: ["Chicken", "Tomato", "Butter", "Cream", "Fenugreek", "Garam masala"],
    isAvailable: true,
  },
  {
    id: "item_005",
    restaurantId: "rest_001",
    categoryId: "cat_mains",
    name: "Paneer Lababdar",
    description: "Soft paneer cubes in a rich cashew-tomato gravy with a hint of saffron.",
    price: 329,
    imageUrl:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: false,
    spiceLevel: 1,
    rating: 4.5,
    ratingCount: 176,
    prepTimeMinutes: 20,
    ingredients: ["Paneer", "Cashew", "Tomato", "Cream", "Saffron"],
    isAvailable: true,
  },
  {
    id: "item_006",
    restaurantId: "rest_001",
    categoryId: "cat_mains",
    name: "Dal Makhani",
    description: "Black lentils and kidney beans, slow-simmered overnight with butter and cream.",
    price: 259,
    imageUrl:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: true,
    spiceLevel: 0,
    rating: 4.7,
    ratingCount: 289,
    prepTimeMinutes: 25,
    ingredients: ["Black urad dal", "Rajma", "Butter", "Cream", "Tomato"],
    isAvailable: true,
  },
  {
    id: "item_007",
    restaurantId: "rest_001",
    categoryId: "cat_mains",
    name: "Mutton Rogan Josh",
    description: "Slow-braised mutton in a Kashmiri red chilli and yoghurt gravy, deeply aromatic.",
    price: 449,
    imageUrl:
      "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&h=450&fit=crop&auto=format",
    isVeg: false,
    isBestSeller: false,
    spiceLevel: 3,
    rating: 4.6,
    ratingCount: 143,
    prepTimeMinutes: 35,
    ingredients: ["Mutton", "Curd", "Kashmiri chilli", "Fennel", "Ginger"],
    isAvailable: true,
  },
  {
    id: "item_008",
    restaurantId: "rest_001",
    categoryId: "cat_breads",
    name: "Butter Naan",
    description: "Leavened tandoor bread brushed with butter, baked to order.",
    price: 69,
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-9d7bd7fbf3f0?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: true,
    spiceLevel: 0,
    rating: 4.5,
    ratingCount: 402,
    prepTimeMinutes: 10,
    ingredients: ["Refined flour", "Yeast", "Curd", "Butter"],
    isAvailable: true,
  },
  {
    id: "item_009",
    restaurantId: "rest_001",
    categoryId: "cat_breads",
    name: "Garlic Naan",
    description: "Tandoor bread topped with roasted garlic and coriander.",
    price: 79,
    imageUrl:
      "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: false,
    spiceLevel: 0,
    rating: 4.4,
    ratingCount: 187,
    prepTimeMinutes: 10,
    ingredients: ["Refined flour", "Garlic", "Coriander", "Butter"],
    isAvailable: true,
  },
  {
    id: "item_010",
    restaurantId: "rest_001",
    categoryId: "cat_rice",
    name: "Hyderabadi Chicken Biryani",
    description: "Long-grain basmati layered with marinated chicken, saffron and fried onions, dum-cooked.",
    price: 359,
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=450&fit=crop&auto=format",
    isVeg: false,
    isBestSeller: true,
    spiceLevel: 2,
    rating: 4.9,
    ratingCount: 618,
    prepTimeMinutes: 30,
    ingredients: ["Basmati rice", "Chicken", "Saffron", "Fried onion", "Mint"],
    isAvailable: true,
  },
  {
    id: "item_011",
    restaurantId: "rest_001",
    categoryId: "cat_rice",
    name: "Veg Dum Biryani",
    description: "Basmati rice dum-cooked with mixed vegetables, whole spices and saffron.",
    price: 279,
    imageUrl:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: false,
    spiceLevel: 2,
    rating: 4.4,
    ratingCount: 156,
    prepTimeMinutes: 28,
    ingredients: ["Basmati rice", "Mixed vegetables", "Saffron", "Whole spices"],
    isAvailable: true,
  },
  {
    id: "item_012",
    restaurantId: "rest_001",
    categoryId: "cat_desserts",
    name: "Gulab Jamun",
    description: "Warm milk-solid dumplings soaked in cardamom-rose syrup.",
    price: 129,
    imageUrl:
      "https://images.unsplash.com/photo-1666190092210-9c9ee5b8f5a1?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: true,
    spiceLevel: 0,
    rating: 4.7,
    ratingCount: 233,
    prepTimeMinutes: 8,
    ingredients: ["Khoya", "Sugar syrup", "Cardamom", "Rose water"],
    isAvailable: true,
  },
  {
    id: "item_013",
    restaurantId: "rest_001",
    categoryId: "cat_desserts",
    name: "Gajar Ka Halwa",
    description: "Slow-cooked grated carrot with milk, ghee and nuts. Seasonal favourite.",
    price: 159,
    imageUrl:
      "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: false,
    spiceLevel: 0,
    rating: 4.5,
    ratingCount: 87,
    prepTimeMinutes: 10,
    ingredients: ["Carrot", "Milk", "Ghee", "Almonds", "Cardamom"],
    isAvailable: true,
  },
  {
    id: "item_014",
    restaurantId: "rest_001",
    categoryId: "cat_beverages",
    name: "Masala Chaas",
    description: "Chilled spiced buttermilk with roasted cumin and curry leaf.",
    price: 79,
    imageUrl:
      "https://images.unsplash.com/photo-1571212515416-fca325e2c923?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: false,
    spiceLevel: 1,
    rating: 4.3,
    ratingCount: 64,
    prepTimeMinutes: 5,
    ingredients: ["Yoghurt", "Cumin", "Curry leaf", "Ginger"],
    isAvailable: true,
  },
  {
    id: "item_015",
    restaurantId: "rest_001",
    categoryId: "cat_beverages",
    name: "Virgin Mojito",
    description: "Fresh mint and lime muddled with soda over crushed ice.",
    price: 149,
    imageUrl:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: true,
    spiceLevel: 0,
    rating: 4.6,
    ratingCount: 121,
    prepTimeMinutes: 6,
    ingredients: ["Mint", "Lime", "Soda", "Sugar syrup"],
    isAvailable: true,
  },

  // --- Bombay Brew Café (rest_002) — a second, unrelated restaurant ---
  {
    id: "bb_item_001",
    restaurantId: "rest_002",
    categoryId: "cat_bb_coffee",
    name: "Flat White",
    description: "Double ristretto shots with silky micro-foamed milk.",
    price: 189,
    imageUrl:
      "https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: true,
    spiceLevel: 0,
    rating: 4.7,
    ratingCount: 156,
    prepTimeMinutes: 6,
    ingredients: ["Espresso", "Milk"],
    isAvailable: true,
  },
  {
    id: "bb_item_002",
    restaurantId: "rest_002",
    categoryId: "cat_bb_coffee",
    name: "Cold Brew",
    description: "Slow-steeped 18 hours, served over ice.",
    price: 179,
    imageUrl:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: false,
    spiceLevel: 0,
    rating: 4.5,
    ratingCount: 88,
    prepTimeMinutes: 4,
    ingredients: ["Coffee concentrate", "Ice", "Water"],
    isAvailable: true,
  },
  {
    id: "bb_item_003",
    restaurantId: "rest_002",
    categoryId: "cat_bb_bakes",
    name: "Almond Croissant",
    description: "Twice-baked, filled with almond cream, dusted with icing sugar.",
    price: 159,
    imageUrl:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&h=450&fit=crop&auto=format",
    isVeg: true,
    isBestSeller: true,
    spiceLevel: 0,
    rating: 4.8,
    ratingCount: 203,
    prepTimeMinutes: 5,
    ingredients: ["Butter", "Almond cream", "Flour", "Icing sugar"],
    isAvailable: true,
  },
  {
    id: "bb_item_004",
    restaurantId: "rest_002",
    categoryId: "cat_bb_allday",
    name: "Avocado Toast",
    description: "Sourdough, smashed avocado, chilli flakes, poached egg.",
    price: 299,
    imageUrl:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=450&fit=crop&auto=format",
    isVeg: false,
    isBestSeller: true,
    spiceLevel: 1,
    rating: 4.6,
    ratingCount: 134,
    prepTimeMinutes: 12,
    ingredients: ["Sourdough", "Avocado", "Egg", "Chilli flakes", "Lemon"],
    isAvailable: true,
  },
  {
    id: "bb_item_005",
    restaurantId: "rest_002",
    categoryId: "cat_bb_allday",
    name: "Shakshuka",
    description: "Eggs poached in a smoky tomato-pepper sauce, served with toast.",
    price: 279,
    imageUrl:
      "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600&h=450&fit=crop&auto=format",
    isVeg: false,
    isBestSeller: false,
    spiceLevel: 2,
    rating: 4.4,
    ratingCount: 71,
    prepTimeMinutes: 15,
    ingredients: ["Eggs", "Tomato", "Bell pepper", "Cumin", "Toast"],
    isAvailable: true,
  },
];

export const coupons: Coupon[] = [
  {
    restaurantId: "rest_001",
    code: "WELCOME10",
    description: "10% off on your first order",
    type: "percent",
    value: 10,
  },
  {
    restaurantId: "rest_001",
    code: "FLAT50",
    description: "Flat ₹50 off on orders above ₹499",
    type: "flat",
    value: 50,
    minOrderValue: 499,
  },
  {
    restaurantId: "rest_002",
    code: "BREW15",
    description: "15% off on your first order",
    type: "percent",
    value: 15,
  },
];

// --- Scoped fetchers: the ONLY functions that filter by restaurantId. ---
// These run once, in RestaurantScopeLayout, when a slug is resolved into
// a restaurant. Everything downstream works with the arrays these return.

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find((r) => r.slug === slug);
}

export function getTablesForRestaurant(restaurantId: string): RestaurantTable[] {
  return tables.filter((t) => t.restaurantId === restaurantId);
}

export function getCategoriesForRestaurant(restaurantId: string): Category[] {
  return categories
    .filter((c) => c.restaurantId === restaurantId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getMenuItemsForRestaurant(restaurantId: string): MenuItem[] {
  return menuItems.filter((item) => item.restaurantId === restaurantId);
}

export function getCouponsForRestaurant(restaurantId: string): Coupon[] {
  return coupons.filter((c) => c.restaurantId === restaurantId);
}

// --- Pure helpers: operate on an already-scoped array handed to them. ---
// Pages/components use these — none of them ever see a restaurantId.

export function getTableByNumber(
  scopedTables: RestaurantTable[],
  num: number
): RestaurantTable | undefined {
  return scopedTables.find((t) => t.number === num);
}

export function getMenuItemsByCategory(scopedItems: MenuItem[], categoryId: string): MenuItem[] {
  return scopedItems.filter((item) => item.categoryId === categoryId);
}

export function getBestSellers(scopedItems: MenuItem[]): MenuItem[] {
  return scopedItems.filter((item) => item.isBestSeller);
}

export function getMenuItemById(scopedItems: MenuItem[], id: string): MenuItem | undefined {
  return scopedItems.find((item) => item.id === id);
}

export function getCouponByCode(scopedCoupons: Coupon[], code: string): Coupon | undefined {
  return scopedCoupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
}

// --- Staff / auth mock data ---

export const staffUsers: StaffUser[] = [
  { id: "staff_001", restaurantId: "rest_001", name: "Ramesh Kumar", email: "ramesh@spiceroute.test", role: "waiter", isActive: true },
  { id: "staff_002", restaurantId: "rest_001", name: "Anita Rao", email: "anita@spiceroute.test", role: "chef", isActive: true },
  { id: "staff_003", restaurantId: "rest_001", name: "Vikram Singh", email: "vikram@spiceroute.test", role: "owner", isActive: true },
  { id: "staff_004", restaurantId: "rest_002", name: "Priya Nair", email: "priya@bombaybrew.test", role: "waiter", isActive: true },
  { id: "staff_005", restaurantId: "rest_002", name: "Rohan Mehta", email: "rohan@bombaybrew.test", role: "owner", isActive: true },
];

// DEMO-ONLY plaintext credentials so the mock login screen has something
// to check against before Supabase Auth is wired up (step 5). Real auth
// must never look like this — this map disappears entirely once Supabase
// owns sessions, hashing and tokens; nothing downstream of `checkStaffCredentials`
// needs to change when that happens.
const staffCredentials: Record<string, string> = {
  "ramesh@spiceroute.test": "waiter123",
  "anita@spiceroute.test": "chef123",
  "vikram@spiceroute.test": "owner123",
  "priya@bombaybrew.test": "waiter123",
  "rohan@bombaybrew.test": "owner123",
};

export function getStaffForRestaurant(restaurantId: string): StaffUser[] {
  return staffUsers.filter((s) => s.restaurantId === restaurantId);
}

export function findStaffByEmail(email: string): StaffUser | undefined {
  return staffUsers.find((s) => s.email.toLowerCase() === email.trim().toLowerCase());
}

export function checkStaffCredentials(email: string, password: string): StaffUser | null {
  const user = findStaffByEmail(email);
  if (!user || !user.isActive) return null;
  if (staffCredentials[user.email] !== password) return null;
  return user;
}

// --- Live order mock data (Waiter dashboard + future Chef KDS) ---

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

export const liveOrders: LiveOrder[] = [
  {
    id: "order_001",
    restaurantId: "rest_001",
    tableNumber: 3,
    orderNumber: "SP-4821",
    items: [
      { id: "li_001", menuItemName: "Paneer Tikka", quantity: 1, price: 289 },
      { id: "li_002", menuItemName: "Butter Naan", quantity: 3, price: 69 },
    ],
    status: "preparing",
    source: "guest",
    placedAt: minutesAgo(12),
    subtotal: 496,
    gstAmount: 25,
    serviceChargeAmount: 25,
    grandTotal: 546,
    isPaid: false,
  },
  {
    id: "order_002",
    restaurantId: "rest_001",
    tableNumber: 7,
    orderNumber: "SP-4822",
    items: [
      { id: "li_003", menuItemName: "Hyderabadi Chicken Biryani", quantity: 2, price: 359 },
      { id: "li_004", menuItemName: "Masala Chaas", quantity: 2, price: 79 },
    ],
    status: "new",
    source: "guest",
    placedAt: minutesAgo(2),
    subtotal: 876,
    gstAmount: 44,
    serviceChargeAmount: 44,
    grandTotal: 964,
    isPaid: false,
  },
  {
    id: "order_003",
    restaurantId: "rest_001",
    tableNumber: 5,
    orderNumber: "SP-4818",
    items: [
      { id: "li_005", menuItemName: "Butter Chicken", quantity: 1, price: 389 },
      { id: "li_006", menuItemName: "Garlic Naan", quantity: 2, price: 79 },
      { id: "li_007", menuItemName: "Gulab Jamun", quantity: 2, price: 129 },
    ],
    status: "served",
    source: "waiter",
    placedAt: minutesAgo(38),
    subtotal: 805,
    gstAmount: 40,
    serviceChargeAmount: 40,
    grandTotal: 885,
    isPaid: false,
  },
  {
    id: "order_004",
    restaurantId: "rest_001",
    tableNumber: 12,
    orderNumber: "SP-4815",
    items: [{ id: "li_008", menuItemName: "Veg Dum Biryani", quantity: 1, price: 279 }],
    status: "ready",
    source: "guest",
    placedAt: minutesAgo(20),
    subtotal: 279,
    gstAmount: 14,
    serviceChargeAmount: 14,
    grandTotal: 307,
    isPaid: false,
  },
  {
    id: "bb_order_001",
    restaurantId: "rest_002",
    tableNumber: 2,
    orderNumber: "BO-1140",
    items: [
      { id: "bli_001", menuItemName: "Flat White", quantity: 2, price: 189 },
      { id: "bli_002", menuItemName: "Almond Croissant", quantity: 2, price: 159 },
    ],
    status: "accepted",
    source: "guest",
    placedAt: minutesAgo(6),
    subtotal: 696,
    gstAmount: 35,
    serviceChargeAmount: 0,
    grandTotal: 731,
    isPaid: false,
  },
  {
    id: "bb_order_002",
    restaurantId: "rest_002",
    tableNumber: 5,
    orderNumber: "BO-1138",
    items: [{ id: "bli_003", menuItemName: "Avocado Toast", quantity: 1, price: 299 }],
    status: "served",
    source: "guest",
    placedAt: minutesAgo(25),
    subtotal: 299,
    gstAmount: 15,
    serviceChargeAmount: 0,
    grandTotal: 314,
    isPaid: false,
  },
];

export function getLiveOrdersForRestaurant(restaurantId: string): LiveOrder[] {
  return liveOrders.filter((o) => o.restaurantId === restaurantId);
}
