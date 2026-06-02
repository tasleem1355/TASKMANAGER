import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext"; // ← NEW
import {
  BookOpen, LogOut, LayoutDashboard, ListTodo, Menu, X,
  User, Settings, Shield, Bell, Palette, Phone, Mail, IdCard,
  Sun, Moon, CalendarDays, // ← NEW icons
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";

// ── Dark Mode Toggle Switch ────────────────────────────────────────────────
function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative inline-flex h-7 w-13 items-center rounded-full border-2 px-0.5
        transition-all duration-300 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-ring focus-visible:ring-offset-2
        ${isDark
          ? "border-primary/60 bg-primary/20"
          : "border-border bg-secondary"
        }
      `}
      style={{ width: "3.25rem" }}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 text-[10px] select-none">
        {isDark ? <Moon className="h-3 w-3 text-primary" /> : null}
      </span>
      <span className="absolute right-1.5 text-[10px] select-none">
        {!isDark ? <Sun className="h-3 w-3 text-amber-500" /> : null}
      </span>

      {/* Thumb */}
      <span
        className={`
          relative z-10 flex h-5 w-5 items-center justify-center rounded-full shadow-sm
          transition-all duration-300
          ${isDark
            ? "translate-x-6 bg-primary text-primary-foreground"
            : "translate-x-0 bg-white text-amber-500"
          }
        `}
      >
        {isDark
          ? <Moon className="h-3 w-3" />
          : <Sun className="h-3 w-3" />
        }
      </span>
    </button>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────────────
export default function Navbar() {
  const { user } = useApp();
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme(); // ← NEW
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
  // Phone management state
  interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
  }

  const [phone, setPhone] = useState<string>("");
  const [savedPhone, setSavedPhone] = useState<string>("");
  const [editingPhone, setEditingPhone] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openProfile = () => {
    setActiveTab("profile");
    setProfileOpen(true);
  };

  // Load phone from localStorage when profile modal opens
  useEffect(() => {
    if (profileOpen && user) {
      try {
        const key = `user_phone_${user.id}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          setSavedPhone(stored);
          setPhone(stored);
        } else {
          setSavedPhone("");
          setPhone("");
        }
      } catch (err) {
        console.error("Failed to read phone from localStorage", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileOpen]);

  const openSettings = () => {
    setActiveTab("settings");
    setProfileOpen(true);
  };

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const navLinks = user
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/tasks", label: "Tasks", icon: ListTodo },
        { to: "/calendar", label: "Calendar", icon: CalendarDays },
      ]
    : [
        { to: "/", label: "Home", icon: null },
        { to: "/#features", label: "Features", icon: null },
      ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md transition-colors duration-300">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>TaskFlow</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.to) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* ── Dark Mode Toggle (desktop) ── */}
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20 transition-all hover:border-primary">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={openProfile} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openSettings} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/login")}>Login</Button>
                <Button size="sm" onClick={() => navigate("/register")}>Register</Button>
              </div>
            )}
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t bg-card p-4 md:hidden transition-colors duration-300">
            <div className="flex flex-col gap-3">
              {user && (
                <div className="flex items-center gap-3 pb-2 border-b">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile theme label row */}
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {isDark ? "Dark Mode" : "Light Mode"}
                </span>
                <button
                  onClick={toggleTheme}
                  className="text-xs text-primary underline underline-offset-2"
                >
                  Switch
                </button>
              </div>

              {user ? (
                <>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => { openProfile(); setMobileOpen(false); }}
                  >
                    <User className="mr-1 h-4 w-4" /> Profile
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => { openSettings(); setMobileOpen(false); }}
                  >
                    <Settings className="mr-1 h-4 w-4" /> Settings
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-1 h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Login</Button>
                  <Button size="sm" onClick={() => { navigate("/register"); setMobileOpen(false); }}>Register</Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── Profile & Settings Dialog ── */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "profile" | "settings")}>

            {/* Header */}
            <DialogHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {user ? getInitials(user.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-base font-semibold truncate">{user?.name}</DialogTitle>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">Student</Badge>
              </div>

              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Profile
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </TabsTrigger>
              </TabsList>
            </DialogHeader>

            {/* ── PROFILE TAB ── */}
            <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
              <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Personal Information */}
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Personal Information</h3>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-name" className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" /> Full Name
                    </Label>
                    <Input id="profile-name" defaultValue={user?.name} readOnly className="bg-background h-8 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-email" className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email Address
                    </Label>
                    <Input id="profile-email" defaultValue={user?.email} readOnly className="bg-background h-8 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-phone" className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </Label>
                    <div className="flex flex-col">
                      {!savedPhone && !editingPhone && (
                        <div className="flex items-center justify-between gap-2">
                          <Input
                            id="profile-phone"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={() => {}}
                            readOnly
                            className="bg-background h-8 text-sm"
                          />
                          <Button size="sm" onClick={() => setEditingPhone(true)}>Add Phone Number</Button>
                        </div>
                      )}

                      {savedPhone && !editingPhone && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium">{savedPhone}</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setEditingPhone(true)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                        </div>
                      )}

                      {editingPhone && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            // Validate only on save
                            const value = phone.trim();
                            if (!/^[0-9]+$/.test(value)) {
                              setPhoneError("Phone number must contain only digits.");
                              return;
                            }
                            if (value.length < 10 || value.length > 15) {
                              setPhoneError("Phone number must be 10 to 15 digits long.");
                              return;
                            }
                            try {
                              const key = `user_phone_${user?.id || "guest"}`;
                              localStorage.setItem(key, value);
                              setSavedPhone(value);
                              setEditingPhone(false);
                              setPhoneError("");
                              toast.success("Phone number updated successfully");
                            } catch (err) {
                              console.error("Failed to save phone", err);
                              setPhoneError("Failed to save phone number.");
                            }
                          }}
                          className="flex flex-col"
                        >
                          <Input
                            id="profile-phone"
                            value={phone}
                            onChange={(e) => {
                              const v = e.target.value.replace(/[^0-9]/g, "");
                              setPhone(v);
                              if (phoneError) setPhoneError("");
                            }}
                            className="bg-background h-8 text-sm rounded-md transition-all"
                            placeholder="Enter phone number"
                            maxLength={15}
                          />

                          {phoneError && <p className="text-xs text-destructive mt-1">{phoneError}</p>}

                          <div className="mt-2 flex gap-2">
                            <Button type="submit" size="sm">Save</Button>
                            <Button size="sm" variant="outline" onClick={() => { setPhone(savedPhone); setEditingPhone(false); setPhoneError(""); }}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Account Details</h3>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-id" className="text-xs text-muted-foreground flex items-center gap-1">
                      <IdCard className="h-3 w-3" /> Student ID
                    </Label>
                    <Input id="profile-id" defaultValue={user?.id} readOnly className="bg-background h-8 text-xs font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Account Type</Label>
                    <div className="flex items-center h-8 px-3 rounded-md border bg-background">
                      <Badge variant="secondary" className="text-xs">Student</Badge>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Member Since</Label>
                    <div className="flex items-center h-8 px-3 rounded-md border bg-background text-sm text-muted-foreground">
                      2024
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 pb-5 pt-1">
                <Button variant="outline" size="sm" onClick={() => setProfileOpen(false)}>Close</Button>
                <Button variant="destructive" size="sm" onClick={() => { setProfileOpen(false); handleLogout(); }}>
                  <LogOut className="mr-1 h-4 w-4" /> Logout
                </Button>
              </div>
            </TabsContent>

            {/* ── SETTINGS TAB ── */}
            <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
              <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Security Settings */}
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Security Settings</h3>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <Label htmlFor="current-password" className="text-xs text-muted-foreground">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" readOnly className="bg-background h-8 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-password" className="text-xs text-muted-foreground">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" readOnly className="bg-background h-8 text-sm" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">Two-factor auth</span>
                    <Badge variant="outline" className="text-xs">Disabled</Badge>
                  </div>
                </div>

                {/* Preferences — now with live dark mode toggle */}
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Preferences</h3>
                  </div>
                  <Separator />

                  {/* ── Theme row with live toggle ── */}
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>

                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Bell className="h-3 w-3" /> Notifications
                    </span>
                    <Badge variant="outline" className="text-xs">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-xs text-muted-foreground">Language</span>
                    <Badge variant="outline" className="text-xs">English</Badge>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-xs text-muted-foreground">Timezone</span>
                    <Badge variant="outline" className="text-xs">UTC</Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 pb-5 pt-1">
                <Button variant="outline" size="sm" onClick={() => setProfileOpen(false)}>Close</Button>
                <Button size="sm" disabled>Save Changes</Button>
              </div>
            </TabsContent>

          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}