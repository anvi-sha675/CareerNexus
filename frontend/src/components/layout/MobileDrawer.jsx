import Drawer from "../common/Drawer";
import Sidebar from "./Sidebar";

export default function MobileDrawer({ open, onClose }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Menu"
      side="left"
      widthClass="max-w-72"
    >
      <div className="-mx-5 -mt-5">
        <Sidebar className="h-[calc(100vh-2rem)] w-full" />
      </div>
    </Drawer>
  );
}
