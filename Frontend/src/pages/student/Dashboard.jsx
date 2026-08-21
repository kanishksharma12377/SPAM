import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Bell, CheckCircle, Clock, XCircle, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { studentAPI } from '../lib/backend-api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [studentRecord, setStudentRecord] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
      navigate('/login?type=student');
      return;
    }

    const user = JSON.parse(userData);
    const userRole = Array.isArray(user.role) ? user.role[0] : user.role;
    
    if (userRole !== 'student') {
      navigate('/login?type=student');
      return;
    }

    if (!user.setup) {
      navigate('/student/setup', { replace: true });
      return;
    }

    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      const [profileRes, recordRes, uploadsRes, noticesRes] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getRecord(),
        studentAPI.getUploads(),
        studentAPI.getNotices()
      ]);

      setStudentData(profileRes.student || null);
      setStudentRecord(recordRes.record || null);
      setUploads(uploadsRes.requests || []);
      setNotices(noticesRes.notices || []);

    } catch (error) {
      console.error('Error fetching student data:', error);
      
      if (error.message && error.message.includes('setup')) {
        toast.error('Please complete your profile setup first');
        navigate('/student/setup');
        return;
      }
      
      if (error.message && (error.message.includes('Unauthorized') || error.message.includes('Invalid token'))) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('userData');
        navigate('/login?type=student');
        return;
      }
      
      toast.error(error.message || 'Failed to load dashboard data');
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

  // Calculate statistics
  const totalUploads = uploads.length;
  const approvedUploads = uploads.filter(u => ['accepted', 'approved'].includes((u.status || '').toLowerCase())).length;
  const pendingUploads = uploads.filter(u => (u.status || '').toLowerCase() === 'pending').length;
  const rejectedUploads = uploads.filter(u => (u.status || '').toLowerCase() === 'rejected').length;
  const unreadNotices = notices.length;

  return (
    <>
      <Navigation role="student" />
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2 capitalize">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, <span className="font-bold">{(studentRecord?.name?.firstName || studentData?.name || 'Student').charAt(0).toUpperCase() + (studentRecord?.name?.firstName || studentData?.name || 'Student').slice(1)}</span>!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-bold">{studentData?.s_id?.toUpperCase()}</span>
            </p>
          </div>

          {/* Main Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Activities */}
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                <Activity className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{totalUploads}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Activities submitted
                </p>
              </CardContent>
            </Card>

            {/* Approved Activities */}
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{approvedUploads}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Activities approved
                </p>
              </CardContent>
            </Card>

            {/* Pending Activities */}
            <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">{pendingUploads}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting review
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Rejected Activities */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{rejectedUploads}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Activities rejected
                </p>
              </CardContent>
            </Card>

            {/* Success Rate */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500">
                  {totalUploads > 0 ? Math.round((approvedUploads / totalUploads) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Approval percentage
                </p>
              </CardContent>
            </Card>

            {/* Unread Notices */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notices</CardTitle>
                <Bell className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{unreadNotices}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  New announcements
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

