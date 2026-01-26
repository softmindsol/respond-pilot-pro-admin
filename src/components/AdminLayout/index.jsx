import { useState, useEffect } from "react";
import { fetchUserProfile } from "@/store/features/auth/authActions";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  CircleDollarSign,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout } from "@/store/features/auth/authSlice";
import { Logo } from "../../assets/svgs";
import { SettingsModal } from "@/components/SettingsComponents";

const navItems = [
  // { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/users", label: "Users", icon: UsersRound },
  { path: "/payments", label: "Payments", icon: CircleDollarSign },
];

const NavItem = ({ item, collapsed, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  const content = (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-r from-yellow to-orange text-[#fff]"
            : "text-light hover:text-white hover:bg-[#2a2828]"
        }
        ${collapsed ? "justify-center" : ""}
      `}
    >
      <item.icon className={`w-5 h-5 ${isActive ? "text-[#fff]" : ""}`} />
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-white border-[#2a2828] text-dark font-semibold tracking-wide font-arial"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

const SidebarContent = ({
  collapsed,
  setCollapsed,
  onNavigate,
  onOpenSettings,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } px-4 py-5`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow to-orange rounded-md flex items-center justify-center">
              <img src="/public/favicon.svg" alt="rpp" />
            </div>
            <span className="font-bold text-white">Admin Panel</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-r from-[#FEC36D] to-[#D78001] rounded-lg flex items-center justify-center">
            <img src="/public/favicon.svg" alt="rpp" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed?.(!collapsed)}
          className={`hidden lg:flex text-light hover:text-black ${
            collapsed
              ? "absolute -right-3 top-6 bg-[#1a1818] border border-[#363A42] rounded-full w-6 h-6 p-0"
              : ""
          }`}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      <Separator className="bg-[#363A42]" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <Separator className="bg-[#363A42]" />

      {/* User Section */}
      <div className={`p-3 ${collapsed ? "flex justify-center" : ""}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full py-7 ${
                collapsed ? "p-0 h-auto" : "justify-start"
              } text-light hover:text-white hover:bg-[#2a2828] h-10`}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={
                    user?.profileImage
                      ? user.profileImage.startsWith("http")
                        ? user.profileImage
                        : `${import.meta.env.VITE_PROFILE_FETCH}${
                            user.profileImage
                          }`
                      : null
                  }
                />
                <AvatarFallback className="bg-gradient-to-r from-[#FEC36D] to-[#D78001] text-white text-sm">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-white">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-light">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={collapsed ? "center" : "start"}
            side={collapsed ? "right" : "top"}
            className="w-56 bg-[#1a1818] border-[#363A42]"
          >
            <DropdownMenuItem
              onClick={onOpenSettings}
              className="text-light focus:text-white focus:bg-[#2a2828] cursor-pointer"
            >
              <Settings className="w-4 h-4 mr-2 text-light" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#363A42]" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red focus:text-red-400 focus:bg-[#2a2828]"
            >
              <LogOut className="w-4 h-4 mr-2 text-light" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Fetch profile on mount and on route change
    dispatch(fetchUserProfile());

    // Fetch profile on window focus (browser tab switch)
    const handleFocus = () => {
      dispatch(fetchUserProfile());
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch, location.pathname]);

  return (
    <div className="flex h-screen bg-[#0f0d0d]">
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col bg-[#1a1818] border-r border-[#363A42] transition-all duration-300 relative
          ${collapsed ? "w-[70px]" : "w-[240px]"}
        `}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[280px] p-0 bg-[#1a1818] border-[#2a2828]"
        >
          <SidebarContent
            onNavigate={() => setMobileOpen(false)}
            onOpenSettings={() => {
              setMobileOpen(false);
              setSettingsOpen(true);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#1a1818] border-b border-[#2a2828] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu className="size-[22px]" />
            </Button>
            <img className="w-28 mx-auto" src={Logo} alt="Respond_Pilot_Pro" />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#2a2828]">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={
                    user?.profileImage
                      ? user.profileImage.startsWith("http")
                        ? user.profileImage
                        : `${import.meta.env.VITE_PROFILE_FETCH}${
                            user.profileImage
                          }`
                      : null
                  }
                />
                <AvatarFallback className="bg-gradient-to-r from-[#FEC36D] to-[#D78001] text-white text-sm">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-light">
                {user?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        user={user}
      />
    </div>
  );
};

export default AdminLayout;
