# RestoBiz — Customer QR Ordering (MVP, Phase 1)

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`). The root route
redirects to a demo menu at `/menu/spice-route/table-5` — that's what a real
QR code on a table would point to.

## What's built (this phase)

Per the brief, this is **only the customer-facing ordering flow** —
dashboard, kanban orders, and menu management are intentionally not started
yet, waiting on your review of this first.

- **Menu page** (`/menu/:slug/:tableParam`) — table auto-detected from the
  URL, sticky header, search, category tabs, popular-items rail, food grid.
- **Product page** — image, description, ingredients, prep time, quantity
  selector, special instructions, add to cart.
- **Cart** — slide-over drawer, editable quantities, GST + service charge,
  coupon box (`WELCOME10`, `FLAT50` are wired up in mock data), grand total.
- **Order success** — success animation and a 4-stage status timeline
  (Received → Preparing → Ready → Served) that auto-advances for demo
  purposes.

## Architecture decisions worth knowing about

**Cart totals are derived, not stored.** `cartStore.ts` computes subtotal,
discount, GST, and service charge as functions on read rather than caching
them in state. This is deliberate: it's impossible for the displayed total
to drift from the line items, which is the single most common bug class in
cart implementations.

**Cart line identity.** Two cart lines for the same dish with *different*
special instructions are kept separate (`itemId::instructionsHash`), same
instructions get merged. This matches how kitchens actually need to see
orders — "1x Paneer Tikka, no onions" and "1x Paneer Tikka" are different
tickets.

**Table detection.** The URL segment `table-5` is parsed client-side in
`MenuPage`. In production this should also be validated against the
`tables` list server-side (via Supabase RLS) so a customer can't spoof a
different table number — noted in the migration section below.

**No Zustand persistence yet.** Cart state resets on refresh. That's
correct for now — once Supabase is wired up, cart state should move to a
`draft_orders` row keyed by table session, not `localStorage`, so a
customer who reopens the QR link mid-meal sees their cart again.

## Project structure

```
src/
  components/
    ui/          shadcn-style primitives (Button, Badge, Input, Sheet)
    menu/         FoodCard, CategoryTabs, SearchBar, RestaurantHeader
    cart/         CartDrawer
  pages/          MenuPage, ProductPage, OrderSuccessPage
  store/          cartStore.ts (Zustand)
  data/           mockData.ts — swap this for services/ when Supabase lands
  types/          index.ts — shaped to mirror future Supabase tables
  lib/            utils.ts (cn, formatINR)
```

## Supabase migration path (when you're ready)

The types in `src/types/index.ts` were written to become your table
schemas directly:

| Type          | Future table    |
|---------------|------------------|
| `Restaurant`  | `restaurants`    |
| `RestaurantTable` | `tables`     |
| `Category`    | `categories`     |
| `MenuItem`    | `menu_items`     |
| `Order` / `CartItem` | `orders` + `order_items` |
| `Coupon`      | `coupons`        |

Migration steps, in order:

1. Create the tables above with matching columns (snake_case), plus RLS
   policies scoping `menu_items`/`categories` reads to `is_available = true`
   for anonymous customers, and scoping `orders` writes to a valid
   `(restaurant_id, table_id)` pair.
2. Add `src/services/supabaseClient.ts` and one `services/*.ts` file per
   table exposing the same function signatures already in
   `mockData.ts` (`getMenuItemsByCategory`, `getMenuItemById`, etc.) but
   returning `Promise<T>` and querying Supabase instead of an array.
3. Swap the imports in `MenuPage`/`ProductPage` from `@/data/mockData` to
   `@/services/*`, wrap the calls in `useEffect`/React Query. Because the
   types didn't change, component internals shouldn't need to change.
4. Move `placeOrder` (currently simulated client-side in `CartDrawer`) to a
   real insert into `orders` + `order_items`, and subscribe to that row
   with Supabase Realtime so `OrderSuccessPage`'s timeline reflects actual
   kitchen status updates instead of the demo `setTimeout`s.

## Next feature (pending your approval)

Restaurant Dashboard: sidebar shell + the metrics/chart home screen, as the
next single feature per the brief's workflow rules.
