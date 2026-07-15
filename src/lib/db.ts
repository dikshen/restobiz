import { supabase } from "@/lib/supabaseClient";
import type {
  Category,
  Coupon,
  LiveOrder,
  LiveOrderStatus,
  MenuItem,
  Restaurant,
  RestaurantTable,
  StaffUser,
} from "@/types";

// ---- Mappers: DB row (snake_case) <-> app type (camelCase) ----

function mapRestaurant(row: any): Restaurant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logoUrl: row.logo_url,
    coverUrl: row.cover_url ?? undefined,
    cuisines: row.cuisines ?? [],
    gstPercent: Number(row.gst_percent),
    serviceChargePercent: Number(row.service_charge_percent),
    currency: row.currency,
  };
}

function mapTable(row: any): RestaurantTable {
  return { id: row.id, restaurantId: row.restaurant_id, number: row.number, label: row.label };
}

function mapCategory(row: any): Category {
  return { id: row.id, restaurantId: row.restaurant_id, name: row.name, sortOrder: row.sort_order };
}

function mapMenuItem(row: any): MenuItem {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.image_url,
    isVeg: row.is_veg,
    isBestSeller: row.is_best_seller,
    spiceLevel: row.spice_level,
    rating: Number(row.rating),
    ratingCount: row.rating_count,
    prepTimeMinutes: row.prep_time_minutes,
    ingredients: row.ingredients ?? [],
    isAvailable: row.is_available,
  };
}

function mapCoupon(row: any): Coupon {
  return {
    restaurantId: row.restaurant_id,
    code: row.code,
    description: row.description,
    type: row.type,
    value: Number(row.value),
    minOrderValue: row.min_order_value != null ? Number(row.min_order_value) : undefined,
  };
}

function mapStaffUser(row: any): StaffUser {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    email: row.email,
    role: row.role,
    isActive: row.is_active,
  };
}

function mapLiveOrder(row: any): LiveOrder {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    tableNumber: row.table_number,
    orderNumber: row.order_number,
    items: row.items ?? [],
    status: row.status,
    source: row.source,
    placedAt: row.placed_at,
    subtotal: Number(row.subtotal),
    gstAmount: Number(row.gst_amount),
    serviceChargeAmount: Number(row.service_charge_amount),
    grandTotal: Number(row.grand_total),
    isPaid: row.is_paid,
  };
}

// ---- Reads ----

export async function fetchRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const { data, error } = await supabase.from("restaurants").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapRestaurant(data) : null;
}

export async function fetchRestaurantById(id: string): Promise<Restaurant | null> {
  const { data, error } = await supabase.from("restaurants").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapRestaurant(data) : null;
}

export async function fetchTablesForRestaurant(restaurantId: string): Promise<RestaurantTable[]> {
  const { data, error } = await supabase
    .from("restaurant_tables")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("number");
  if (error) throw error;
  return (data ?? []).map(mapTable);
}

export async function fetchCategoriesForRestaurant(restaurantId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map(mapCategory);
}

export async function fetchMenuItemsForRestaurant(restaurantId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId);
  if (error) throw error;
  return (data ?? []).map(mapMenuItem);
}

export async function fetchCouponsForRestaurant(restaurantId: string): Promise<Coupon[]> {
  const { data, error } = await supabase.from("coupons").select("*").eq("restaurant_id", restaurantId);
  if (error) throw error;
  return (data ?? []).map(mapCoupon);
}

export async function fetchStaffForRestaurant(restaurantId: string): Promise<StaffUser[]> {
  const { data, error } = await supabase.from("staff_users").select("*").eq("restaurant_id", restaurantId);
  if (error) throw error;
  return (data ?? []).map(mapStaffUser);
}

export async function fetchStaffUserById(id: string): Promise<StaffUser | null> {
  const { data, error } = await supabase.from("staff_users").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapStaffUser(data) : null;
}

export async function fetchLiveOrdersForRestaurant(restaurantId: string): Promise<LiveOrder[]> {
  const { data, error } = await supabase
    .from("live_orders")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("placed_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapLiveOrder);
}

// ---- Writes ----

export async function insertLiveOrder(order: LiveOrder): Promise<void> {
  const { error } = await supabase.from("live_orders").insert({
    id: order.id,
    restaurant_id: order.restaurantId,
    table_number: order.tableNumber,
    order_number: order.orderNumber,
    items: order.items,
    status: order.status,
    source: order.source,
    placed_at: order.placedAt,
    subtotal: order.subtotal,
    gst_amount: order.gstAmount,
    service_charge_amount: order.serviceChargeAmount,
    grand_total: order.grandTotal,
    is_paid: order.isPaid,
  });
  if (error) throw error;
}

export async function updateLiveOrderStatus(orderId: string, status: LiveOrderStatus): Promise<void> {
  const { error } = await supabase.from("live_orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

export async function markLiveOrderPaid(orderId: string): Promise<void> {
  const { error } = await supabase.from("live_orders").update({ is_paid: true }).eq("id", orderId);
  if (error) throw error;
}

export async function insertMenuItem(item: MenuItem): Promise<void> {
  const { error } = await supabase.from("menu_items").insert({
    id: item.id,
    restaurant_id: item.restaurantId,
    category_id: item.categoryId,
    name: item.name,
    description: item.description,
    price: item.price,
    image_url: item.imageUrl,
    is_veg: item.isVeg,
    is_best_seller: item.isBestSeller,
    spice_level: item.spiceLevel,
    rating: item.rating,
    rating_count: item.ratingCount,
    prep_time_minutes: item.prepTimeMinutes,
    ingredients: item.ingredients,
    is_available: item.isAvailable,
  });
  if (error) throw error;
}

export async function updateMenuItemRow(id: string, updates: Partial<MenuItem>): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (updates.categoryId !== undefined) patch.category_id = updates.categoryId;
  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.description !== undefined) patch.description = updates.description;
  if (updates.price !== undefined) patch.price = updates.price;
  if (updates.imageUrl !== undefined) patch.image_url = updates.imageUrl;
  if (updates.isVeg !== undefined) patch.is_veg = updates.isVeg;
  if (updates.isBestSeller !== undefined) patch.is_best_seller = updates.isBestSeller;
  if (updates.spiceLevel !== undefined) patch.spice_level = updates.spiceLevel;
  if (updates.prepTimeMinutes !== undefined) patch.prep_time_minutes = updates.prepTimeMinutes;
  if (updates.ingredients !== undefined) patch.ingredients = updates.ingredients;
  if (updates.isAvailable !== undefined) patch.is_available = updates.isAvailable;

  const { error } = await supabase.from("menu_items").update(patch).eq("id", id);
  if (error) throw error;
}

export { mapLiveOrder, mapMenuItem };
