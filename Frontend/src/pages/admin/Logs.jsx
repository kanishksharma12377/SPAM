import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ArrowLeft, FileText, Calendar, Search, User } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { adminAPI } from '../lib/backend-api';

export default function AdminLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, teacher, student
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in as admin
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login?type=admin');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      navigate('/login?type=admin');
      return;
    }

    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getLogs();
      console.log('Admin logs response:', response);
      setLogs(response.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      
      if (error.message && (error.message.includes('Unauthorized') || error.message.includes('Invalid token'))) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('userData');
        navigate('/login?type=admin');
        return;
      }
      
      toast.error(error.message || 'Failed to load system logs');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logs
  const filteredLogs = logs
    .filter(log => {
      // Filter by role
      if (filter !== 'all' && log.by !== filter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.type.toLowerCase().includes(query) ||
          (log.s_id && log.s_id.toLowerCase().includes(query)) ||
          (log.detail && JSON.stringify(log.detail).toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time)); // Sort by newest first

  const getLogTypeBadge = (type) => {
    const typeColors = {
      setup: 'bg-blue-500',
      request: 'bg-yellow-500',
      update: 'bg-green-500',
      register: 'bg-purple-500',
      unregister: 'bg-red-500',
      notice: 'bg-indigo-500'
    };
    return (
      <Badge className={typeColors[type] || 'bg-gray-500'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const getRoleBadge = (by) => {
    return by === 'teacher' ? (
      <Badge variant="default">Admin</Badge>
    ) : (
      <Badge variant="secondary">Student</Badge>
    );
  };

  const getLogDescription = (log) => {
    const descriptions = {
      setup: 'Profile setup completed',
      request: 'Verification request submitted',
      update: 'Profile/Record updated',
      register: 'Student registered',
      unregister: 'Student unregistered',
      notice: 'Notice created'
    };
    return descriptions[log.type] || log.type;
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Loading system logs...</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link to="/admin/dashboard">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-primary mb-2">System Logs</h1>
              <p className="text-muted-foreground">Monitor all system activities and user actions</p>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All Logs
                </Button>
                <Button
                  variant={filter === 'teacher' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('teacher')}
                >
                  Admin Actions
                </Button>
                <Button
                  variant={filter === 'student' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('student')}
                >
                  Student Actions
                </Button>
              </div>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search logs by type, student ID, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Logs List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  System Activity History ({filteredLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No logs found matching your search' : 'No system logs found'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredLogs.map((log) => (
                      <div 
                        key={log.l_id} 
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {getRoleBadge(log.by)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {getLogTypeBadge(log.type)}
                            <span className="font-semibold">{getLogDescription(log)}</span>
                          </div>
                          
                          {log.s_id && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <User className="h-3 w-3" />
                              <span>Student: <span className="font-medium">{log.s_id}</span></span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(log.time).toLocaleString()}</span>
                          </div>
                          
                          {log.detail && Object.keys(log.detail).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-sm text-primary cursor-pointer hover:underline">
                                View Details
                              </summary>
                              <pre className="text-xs mt-2 bg-background p-3 rounded overflow-auto max-h-40 border">
                                {JSON.stringify(log.detail, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics Card */}
            {logs.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{logs.length}</p>
                      <p className="text-sm text-muted-foreground">Total Logs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {logs.filter(l => l.by === 'teacher').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Admin Actions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {logs.filter(l => l.by === 'student').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Student Actions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {new Set(logs.map(l => l.type)).size}
                      </p>
                      <p className="text-sm text-muted-foreground">Activity Types</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
