import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Bell, Plus, Trash2, Calendar, Tag, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { adminAPI } from '../lib/backend-api';

export default function AdminNotices() {
  const navigate = useNavigate();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'general',
    for: 'allStudents', // 'allStudents', 'specific', 'filtered'
    subject: '',
    body: '',
    expire_date: '',
    // For specific student IDs
    specificStudentIds: '',
    // For filtered students
    selectedYears: [],
    selectedBranches: [],
    skilledStatus: 'none'
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login?type=admin');
      return;
    }

    const user = JSON.parse(userData);
    const userRole = Array.isArray(user.role) ? user.role[0] : user.role;
    
    if (userRole !== 'admin') {
      navigate('/login?type=admin');
      return;
    }

    fetchNotices();
  }, [navigate]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getNotices();
      console.log('Notices response:', response);
      setNotices(response.notices || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      // Build the 'for' field based on selection
      let forField;
      
      if (formData.for === 'allStudents') {
        forField = ['student'];
      } else if (formData.for === 'specific') {
        // Parse comma-separated student IDs
        const ids = formData.specificStudentIds
          .split(',')
          .map(id => id.trim().toLowerCase())
          .filter(id => id.length > 0);
        
        if (ids.length === 0) {
          toast.error('Please enter at least one student ID');
          return;
        }
        forField = ids;
      } else if (formData.for === 'filtered') {
        const selectedYears = [...new Set(formData.selectedYears)];
        const selectedBranches = [...new Set(formData.selectedBranches)];

        if (selectedYears.length === 0 || selectedBranches.length === 0) {
          toast.error('Please select at least one year and one branch');
          return;
        }
        forField = [
          selectedYears,
          selectedBranches,
          formData.skilledStatus
        ];
      }

      if (!formData.expire_date || formData.expire_date < tomorrow) {
        toast.error('Expiry date must be at least tomorrow');
        return;
      }
      
      const noticeData = {
        category: formData.category,
        for: forField,
        subject: formData.subject.trim(),
        body: formData.body.trim(),
        expire_date: formData.expire_date
      };

      await adminAPI.createNotice(noticeData);
      toast.success('Notice created successfully!');
      setShowCreateForm(false);
      setFormData({
        category: 'general',
        for: 'allStudents',
        subject: '',
        body: '',
        expire_date: '',
        specificStudentIds: '',
        selectedYears: [],
        selectedBranches: [],
        skilledStatus: 'none'
      });
      fetchNotices();
    } catch (error) {
      toast.error(error.message || error.error || 'Failed to create notice');
    }
  };

  const handleDeleteNotice = async (n_id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      await adminAPI.deleteNotice(n_id);
      toast.success('Notice deleted successfully!');
      fetchNotices();
    } catch (error) {
      toast.error(error.message || 'Failed to delete notice');
    }
  };

  const handleYearToggle = (year, checked) => {
    setFormData(prev => ({
      ...prev,
      selectedYears: checked
        ? [...prev.selectedYears, year]
        : prev.selectedYears.filter(y => y !== year)
    }));
  };

  const handleBranchToggle = (branch, checked) => {
    setFormData(prev => ({
      ...prev,
      selectedBranches: checked
        ? [...prev.selectedBranches, branch]
        : prev.selectedBranches.filter(b => b !== branch)
    }));
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      exam: 'bg-red-100 text-red-800',
      project: 'bg-purple-100 text-purple-800',
      internship: 'bg-green-100 text-green-800',
      job: 'bg-yellow-100 text-yellow-800',
      event: 'bg-pink-100 text-pink-800',
      update: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.general;
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
    
    return `${forField.length} specific student(s)`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <Navigation role="admin" />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Notice Board</h1>
            <p className="text-muted-foreground">Create and manage announcements for students</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Notice
          </Button>
        </div>

        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Notice</CardTitle>
              <CardDescription>Post an announcement for students</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateNotice} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="general">General</option>
                    <option value="exam">Exam</option>
                    <option value="project">Project</option>
                    <option value="internship">Internship</option>
                    <option value="job">Job</option>
                    <option value="event">Event</option>
                    <option value="update">Update</option>
                  </select>
                </div>

                {/* Target Audience Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Target Audience
                  </Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="allStudents"
                        name="targetAudience"
                        checked={formData.for === 'allStudents'}
                        onChange={() => setFormData({ ...formData, for: 'allStudents' })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="allStudents" className="font-normal cursor-pointer">
                        All Students
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="specific"
                        name="targetAudience"
                        checked={formData.for === 'specific'}
                        onChange={() => setFormData({ ...formData, for: 'specific' })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="specific" className="font-normal cursor-pointer">
                        Specific Students (by ID)
                      </Label>
                    </div>

                    {formData.for === 'specific' && (
                      <div className="ml-6 space-y-2">
                        <Label htmlFor="studentIds" className="text-sm text-muted-foreground">
                          Student IDs (comma-separated, e.g., scs0001, sme0015)
                        </Label>
                        <Input
                          id="studentIds"
                          value={formData.specificStudentIds}
                          onChange={(e) => setFormData({ ...formData, specificStudentIds: e.target.value })}
                          placeholder="scs0001, sme0015, sce0022"
                          required={formData.for === 'specific'}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="filtered"
                        name="targetAudience"
                        checked={formData.for === 'filtered'}
                        onChange={() => setFormData({ ...formData, for: 'filtered' })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="filtered" className="font-normal cursor-pointer">
                        Filtered by Year/Branch
                      </Label>
                    </div>

                    {formData.for === 'filtered' && (
                      <div className="ml-6 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Years</Label>
                          <div className="flex gap-4">
                            {['1yr', '2yr', '3yr', '4yr'].map((year) => (
                              <div key={year} className="flex items-center space-x-2">
                                <Checkbox
                                  id={year}
                                  checked={formData.selectedYears.includes(year)}
                                  onChange={(e) => handleYearToggle(year, e.target.checked)}
                                />
                                <Label htmlFor={year} className="font-normal cursor-pointer">
                                  {year}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Branches</Label>
                          <div className="flex gap-4">
                            {['cs', 'me', 'ce', 'ee'].map((branch) => (
                              <div key={branch} className="flex items-center space-x-2">
                                <Checkbox
                                  id={branch}
                                  checked={formData.selectedBranches.includes(branch)}
                                  onChange={(e) => handleBranchToggle(branch, e.target.checked)}
                                />
                                <Label htmlFor={branch} className="font-normal cursor-pointer">
                                  {branch.toUpperCase()}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="skilledStatus" className="text-sm text-muted-foreground">
                            Skilled Status
                          </Label>
                          <select
                            id="skilledStatus"
                            value={formData.skilledStatus}
                            onChange={(e) => setFormData({ ...formData, skilledStatus: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <option value="none">Not Specified</option>
                            <option value="skilled">Skilled Only</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Subject <span className="text-sm text-muted-foreground">(max 100 characters)</span>
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    maxLength={100}
                    required
                    placeholder="Enter notice subject"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {formData.subject.length}/100
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label htmlFor="body">
                    Body <span className="text-sm text-muted-foreground">(max 2000 characters)</span>
                  </Label>
                  <Textarea
                    id="body"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    maxLength={2000}
                    required
                    placeholder="Enter notice details"
                    rows={6}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {formData.body.length}/2000
                  </div>
                </div>

                {/* Expire Date */}
                <div className="space-y-2">
                  <Label htmlFor="expire_date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expiry Date
                  </Label>
                  <Input
                    id="expire_date"
                    type="date"
                    value={formData.expire_date}
                    onChange={(e) => setFormData({ ...formData, expire_date: e.target.value })}
                    min={tomorrow}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">Create Notice</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Notices ({notices.length})</CardTitle>
            <CardDescription>Manage all announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notices.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notices posted yet</p>
                </div>
              ) : (
                notices.map((notice) => (
                  <Card key={notice.n_id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          {/* Header with Category and Date */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={getCategoryBadgeColor(notice.category)}>
                              {notice.category.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(notice.issue_date).toLocaleDateString()}
                            </Badge>
                            {notice.expire_date && (
                              <Badge variant="outline" className="gap-1">
                                Expires: {new Date(notice.expire_date).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Subject */}
                          <h3 className="font-bold text-xl text-primary">
                            {notice.subject}
                          </h3>
                          
                          {/* Target Audience */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{formatTargetAudience(notice.for)}</span>
                          </div>
                          
                          {/* Body */}
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {notice.body}
                          </p>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteNotice(notice.n_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
