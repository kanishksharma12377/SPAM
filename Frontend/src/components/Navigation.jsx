import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home as HomeIcon, User, Shield, LayoutDashboard, Users, FileText, Bell, Upload, Award, LogOut, History } from "lucide-react";
import { authAPI, studentAPI } from '../pages/lib/backend-api';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export function Navigation({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [noticeCount, setNoticeCount] = useState(0);

  // Fetch notice count for students
  useEffect(() => {
    if (role === 'student') {
      fetchNoticeCount();
      // Refresh notice count every 5 minutes
      const interval = setInterval(fetchNoticeCount, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [role]);

  const fetchNoticeCount = async () => {
    try {
      const response = await studentAPI.getNotices();
      setNoticeCount(response.notices?.length || 0);
    } catch (error) {
      console.error('Error fetching notice count:', error);
    }
  };

  // On the login page we only show a compact logo area (no full navigation)
  if (pathname && pathname.startsWith('/login')) {
    return (
      <nav className="bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-20 justify-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/spam-logo.svg" alt="SPAM logo" className="h-10 w-10 object-contain" />
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-2xl text-primary">SPAM</span>
                <span className="text-xs text-muted-foreground">Student Portfolio & Achievement Management</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('userData');
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  const adminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/profile", label: "Profile", icon: User },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/records", label: "Records", icon: FileText },
    { href: "/admin/submissions", label: "Submissions", icon: Upload },
    { href: "/admin/notices", label: "Notices", icon: Bell },
    { href: "/admin/logs", label: "Logs", icon: History },
  ];

  const studentNavItems = [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/profile", label: "Profile", icon: User },
    { href: "/student/upload", label: "Upload", icon: Upload },
    { href: "/student/portfolio", label: "Portfolio", icon: FileText },
    { href: "/student/notices", label: "Notices", icon: Bell },
  ];

  const homeNavItems = [];

  const navItems = role === 'admin' ? adminNavItems : role === 'student' ? studentNavItems : homeNavItems;

  return (
    <nav className="bg-card/50 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={role === 'admin' ? '/admin/dashboard' : role === 'student' ? '/student/dashboard' : '/'} className="flex items-center space-x-2">
            <img src="/spam-logo.svg" alt="SPAM logo" className="h-8 w-8 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary">SPAM</span>
              <span className="text-xs text-muted-foreground">Student Portfolio & Achievement Management</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isNoticesPage = item.label === "Notices";
              const hasNotices = isNoticesPage && noticeCount > 0;
              
              return (
                <Button 
                  key={item.href} 
                  variant={pathname === item.href ? "default" : "ghost"} 
                  asChild 
                  className="flex items-center space-x-2"
                >
                  <Link to={item.href}>
                    <Icon className="h-4 w-4"/>
                    <span className="relative">
                      {item.label}
                      {hasNotices && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </span>
                  </Link>
                </Button>
              );
            })}
            
            {role && (
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4"/>
                <span>Logout</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <HomeIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
