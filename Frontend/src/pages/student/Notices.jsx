import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Bell, Calendar, Users, AlertCircle, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { studentAPI } from '../lib/backend-api';

export default function StudentNotices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

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

    setUserRole(user);
    fetchNotices();
  }, [navigate]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getNotices();
      console.log('Student Notices response:', response);
      setNotices(response.notices || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800 border-blue-200',
      exam: 'bg-red-100 text-red-800 border-red-200',
      project: 'bg-purple-100 text-purple-800 border-purple-200',
      internship: 'bg-green-100 text-green-800 border-green-200',
      job: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      event: 'bg-pink-100 text-pink-800 border-pink-200',
      update: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors.general;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      exam: '📝',
      project: '💼',
      internship: '🎓',
      job: '💰',
      event: '🎉',
      update: '🔔',
      general: '📢'
    };
    return icons[category] || icons.general;
  };

  const formatTargetAudience = (forField) => {
    if (!forField || forField.length === 0) return 'Unknown';
    
    if (forField.length === 1 && forField[0] === 'student') {
      return 'All Students';
    }
    
    if (Array.isArray(forField[0]) && Array.isArray(forField[1])) {
      const years = forField[0].join(', ');
      const branches = forField[1].join(', ').toUpperCase();
      const skilled = forField[2] === 'skilled' ? ' (Skilled)' : '';
      return `${years} - ${branches}${skilled}`;
    }
    
    // Check if student ID is in the for field
    // userRole.role is array: ["student", "scs0001", "2yr", "cs", "none"]
    const studentId = Array.isArray(userRole?.role) ? userRole.role[1] : userRole?.s_id;
    if (studentId && forField.includes(studentId)) {
      return 'Specifically for you';
    }
    
    return 'Selected Students';
  };

  const getDaysUntilExpiry = (expireDate) => {
    const today = new Date();
    const expiry = new Date(expireDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // eslint-disable-next-line no-unused-vars
  const getExpiryBadgeVariant = (expireDate) => {
    const daysLeft = getDaysUntilExpiry(expireDate);
    if (daysLeft <= 3) return 'destructive';
    if (daysLeft <= 7) return 'warning';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <Navigation role="student" />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-primary">Notice Board</h1>
            </div>
            <p className="text-muted-foreground">
              Important announcements and updates for you
            </p>
          </div>
          {notices.length > 0 && (
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {notices.length} Active Notice{notices.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Notices List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Active Notices
            </CardTitle>
            <CardDescription>
              Notices are personalized based on your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notices.length === 0 ? (
                <div className="text-center py-16">
                  <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No Active Notices
                  </h3>
                  <p className="text-muted-foreground">
                    You don't have any notices at the moment. Check back later!
                  </p>
                </div>
              ) : (
                notices.map((notice) => {
                  const daysLeft = getDaysUntilExpiry(notice.expire_date);
                  const isUrgent = daysLeft <= 3;
                  const studentId = Array.isArray(userRole?.role) ? userRole.role[1] : userRole?.s_id;
                  const isPersonal = studentId && notice.for.includes(studentId);
                  
                  return (
                    <Card 
                      key={notice.n_id} 
                      className={`hover:shadow-lg transition-all duration-200 ${
                        isUrgent ? 'border-red-300 bg-red-50/30' : ''
                      } ${isPersonal ? 'border-blue-400 bg-blue-50/30' : ''}`}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header Section */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{getCategoryIcon(notice.category)}</span>
                              <div className="flex flex-wrap gap-2">
                                <Badge className={getCategoryBadgeColor(notice.category)}>
                                  {notice.category.toUpperCase()}
                                </Badge>
                                {isPersonal && (
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    📌 Personal
                                  </Badge>
                                )}
                                {isUrgent && (
                                  <Badge variant="destructive" className="gap-1 animate-pulse">
                                    <AlertCircle className="h-3 w-3" />
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Subject */}
                          <h3 className="font-bold text-2xl text-primary leading-tight">
                            {notice.subject}
                          </h3>

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Posted: {new Date(notice.issue_date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className={daysLeft <= 3 ? 'font-semibold text-red-600' : ''}>
                                Expires: {new Date(notice.expire_date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                                {daysLeft > 0 && (
                                  <span className="ml-1">
                                    ({daysLeft} day{daysLeft !== 1 ? 's' : ''} left)
                                  </span>
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{formatTargetAudience(notice.for)}</span>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="bg-white/50 rounded-lg p-4 border">
                            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                              {notice.body}
                            </p>
                          </div>

                          {/* Footer Info */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <p className="text-xs text-muted-foreground">
                              Notice ID: #{notice.n_id}
                            </p>
                            {daysLeft <= 7 && daysLeft > 3 && (
                              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                ⚠️ Expiring Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
