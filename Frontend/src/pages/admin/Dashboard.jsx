import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, FileText, Bell, Upload, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { adminAPI } from '../lib/backend-api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubmissions: 0,
    pendingApprovals: 0,
    approvedActivities: 0,
    totalNotices: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    console.log('Admin Dashboard - checking userData:', userData);
    
    if (!userData) {
      console.log('No userData found, redirecting to login');
      navigate('/login?type=admin');
      return;
    }

    const user = JSON.parse(userData);
    console.log('Parsed admin user:', user);
    
    if (user.role !== 'admin') {
      console.log('User is not an admin, redirecting to login');
      navigate('/login?type=admin');
      return;
    }

    console.log('Admin verified, fetching dashboard data');
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin profile
      const profileRes = await adminAPI.getProfile();
      setAdminProfile(profileRes.admin);

      // Fetch registered students
      const studentsRes = await adminAPI.getRegisteredStudents();

      // Fetch upload requests
      const uploadsRes = await adminAPI.getUploadRequests();

      // Fetch notices
      const noticesRes = await adminAPI.getNotices();

      // Calculate stats
      const studentsList = studentsRes.students || [];
      const uploadsList = uploadsRes.requests || [];
      const noticesList = noticesRes.notices || [];
      
      setStats({
        totalStudents: studentsList.length,
        totalSubmissions: uploadsList.length,
        pendingApprovals: uploadsList.filter(r => r.status === 'pending').length,
        approvedActivities: uploadsList.filter(r => r.status === 'approved').length,
        totalNotices: noticesList.length
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation role="admin" />
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, <span className="font-bold">{adminProfile?.name || 'Admin'}</span>!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your system efficiently from here
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered in system</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <FileText className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground mt-1">All activities</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-600 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Upload className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
                <Bell className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.totalNotices}</div>
                <p className="text-xs text-muted-foreground mt-1">Posted announcements</p>
              </CardContent>
            </Card>
          </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Link to="/admin/students">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Students</h3>
                    <p className="text-sm text-muted-foreground">Manage student accounts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/records">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-500">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-purple-100 rounded-full">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Records</h3>
                    <p className="text-sm text-muted-foreground">View student portfolios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/submissions">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-yellow-500">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-yellow-100 rounded-full">
                    <Upload className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Submissions</h3>
                    <p className="text-sm text-muted-foreground">Review submissions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/notices">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-green-500">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <Bell className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Notices</h3>
                    <p className="text-sm text-muted-foreground">Post announcements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-500">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Reports</h3>
                  <p className="text-sm text-muted-foreground">View analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </main>
      </div>
    </>
  );
}
