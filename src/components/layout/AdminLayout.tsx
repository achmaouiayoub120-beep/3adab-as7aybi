import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { motion } from "framer-motion";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pl-64 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="container mx-auto px-8 py-8"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
