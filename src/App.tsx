import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute, AdminRoute } from "@/guards/AuthGuards";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminLayout from "@/components/layout/AdminLayout";

// Public Pages
import Home from "@/pages/Home";
import Matches from "@/pages/Matches";
import Reservation from "@/pages/Reservation";
import Stadiums from "@/pages/Stadiums";
import StadiumDetails from "@/pages/StadiumDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Classement from "@/pages/Classement";

// Protected Pages
import UserDashboard from "@/pages/UserDashboard";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import TeamsManagement from "@/pages/admin/TeamsManagement";
import StadiumsManagement from "@/pages/admin/StadiumsManagement";
import MatchesManagement from "@/pages/admin/MatchesManagement";
import UsersManagement from "@/pages/admin/UsersManagement";
import TicketingManagement from "@/pages/admin/TicketingManagement";
import Analytics from "@/pages/admin/Analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster richColors position="top-right" />
          <Routes>
            {/* Admin Routes — no Navbar/Footer */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="teams" element={<TeamsManagement />} />
              <Route path="stadiums" element={<StadiumsManagement />} />
              <Route path="matches" element={<MatchesManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="ticketing" element={<TicketingManagement />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>

            {/* Public + Protected Routes — with Navbar/Footer */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="pt-16 min-h-screen">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/matches" element={<Matches />} />
                      <Route path="/reservation/:matchId" element={<PrivateRoute><Reservation /></PrivateRoute>} />
                      <Route path="/stadiums" element={<Stadiums />} />
                      <Route path="/stadiums/:id" element={<StadiumDetails />} />
                      <Route path="/classement" element={<Classement />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
