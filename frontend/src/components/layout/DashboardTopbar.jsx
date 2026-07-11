import { Menu } from "lucide-react";
import SearchInput from "../common/SearchInput";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import ThemeSwitch from "./ThemeSwitch";

export default function DashboardTopbar({
  onMenuClick,
  search,
  onSearchChange,
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden max-w-sm flex-1 sm:block">
        {onSearchChange && (
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search..."
          />
        )}
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <ThemeSwitch />
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
}
