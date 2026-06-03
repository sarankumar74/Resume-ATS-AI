import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, Upload, History, Settings, LogOut, ScanLine, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/upload", icon: Upload, label: "New Scan" },
  { to: "/history", icon: History, label: "History" },
  { to: "/settings", icon: Settings, label: "Settings" },
] as const;

export function ProtectedLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center bg-hero text-muted-foreground">Loading…</div>;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-gradient-primary text-primary-foreground shadow-glow"
        : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
    }`;

  const NavList = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <nav className="mt-4 space-y-1">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} onClick={onItemClick} className={linkClass}>
            <n.icon className="h-4 w-4" /> {n.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => {
          onItemClick?.();
          handleLogout();
        }}
        className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </>
  );

  const Brand = () => (
    <Link to="/dashboard" className="flex items-center gap-2 px-1 py-1">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
        <ScanLine className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="font-display text-lg font-bold">
        Resume<span className="text-gradient">IQ</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-hero">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/70 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Brand />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="glass" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l border-border bg-background/95 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <Brand />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavList onItemClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="glass sticky top-6 rounded-2xl p-4">
            <Brand />
            <NavList />
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
