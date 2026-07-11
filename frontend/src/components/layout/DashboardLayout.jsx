import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileDrawer from "./MobileDrawer";
import DashboardTopbar from "./DashboardTopbar";
import CommandPalette from "./CommandPalette";

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface dark:bg-slate-950">
      <Sidebar className="hidden lg:flex" />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
