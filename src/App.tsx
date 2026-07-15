import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MenuPage } from "@/pages/MenuPage";
import { ProductPage } from "@/pages/ProductPage";
import { OrderSuccessPage } from "@/pages/OrderSuccessPage";
import { StaffLoginPage } from "@/pages/auth/StaffLoginPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { WaiterDashboard } from "@/pages/waiter/WaiterDashboard";
import { ChefDashboard } from "@/pages/chef/ChefDashboard";
import { OwnerDashboard } from "@/pages/owner/OwnerDashboard";
import { RestaurantScopeLayout } from "@/context/RestaurantContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

function DemoHome() {
  // Convenience landing route for local dev — a real QR code points
  // straight at /menu/:slug/:tableParam. Try /menu/bombay-brew-cafe/table-3
  // to see the second, fully isolated restaurant on the same running app.
  return <Navigate to="/menu/spice-route/table-5" replace />;
}

function App() {
  const initAuth = useAuthStore((s) => s.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/" element={<DemoHome />} />

      {/* Customer (guest) — no login, scoped by URL slug */}
      <Route path="/menu/:slug/:tableParam" element={<RestaurantScopeLayout />}>
        <Route index element={<MenuPage />} />
        <Route path="item/:itemId" element={<ProductPage />} />
      </Route>
      <Route path="/order-success" element={<OrderSuccessPage />} />

      {/* Staff auth */}
      <Route path="/login" element={<StaffLoginPage />} />
      <Route path="/coming-soon" element={<ComingSoonPage />} />

      {/* Waiter — logged in, scoped by their own restaurantId */}
      <Route element={<ProtectedRoute allowedRoles={["waiter"]} />}>
        <Route path="/waiter" element={<WaiterDashboard />} />
      </Route>

      {/* Chef — logged in, scoped by their own restaurantId, shares
          useLiveOrdersStore with the waiter dashboard above */}
      <Route element={<ProtectedRoute allowedRoles={["chef"]} />}>
        <Route path="/chef" element={<ChefDashboard />} />
      </Route>

      {/* Owner — logged in, read-only overview scoped by restaurantId */}
      <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
        <Route path="/owner" element={<OwnerDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
