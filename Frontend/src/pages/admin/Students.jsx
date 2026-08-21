import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Users, Plus, Edit, Trash2, Search, Eye, EyeOff, Key } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { adminAPI, resolveAssetUrl } from '../lib/backend-api';

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [studentRecords, setStudentRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    s_id: '',
    name: '',
    username: '',
    password: '',
    role1: '1yr',
    role2: 'cs',
    role3: 'none'
  });
  const [editFormData, setEditFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
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

    fetchStudents();
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRegisteredStudents();
      console.log('Students response:', response);
      setStudents(response.students || []);
      
      // Fetch student records to get their profile pictures
      const recordsResponse = await adminAPI.getRecordsList();
      if (recordsResponse.success && recordsResponse.records) {
        const recordsMap = {};
        recordsResponse.records.forEach(record => {
          recordsMap[record.s_id] = record;
        });
        setStudentRecords(recordsMap);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.registerStudent(formData);
      toast.success('Student registered successfully!');
      setShowRegisterForm(false);
      setFormData({ s_id: '', name: '', username: '', password: '', role1: '1yr', role2: 'cs', role3: 'none' });
      fetchStudents();
    } catch (error) {
      toast.error(error.message || 'Failed to register student');
    }
  };

  const handleDeleteStudent = async (s_id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await adminAPI.deleteStudent(s_id);
      toast.success('Student deleted successfully!');
      fetchStudents();
    } catch (error) {
      toast.error(error.message || 'Failed to delete student');
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditFormData({
      username: student.username,
      password: ''
    });
    setShowEditDialog(true);
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    try {
      const updateData = { username: editFormData.username };
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }
      
      await adminAPI.updateStudentCredentials(editingStudent.s_id, updateData);
      toast.success('Credentials updated successfully!');
      setShowEditDialog(false);
      setEditingStudent(null);
      setEditFormData({ username: '', password: '' });
      fetchStudents();
    } catch (error) {
      toast.error(error.message || 'Failed to update credentials');
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.username?.toLowerCase().includes(searchLower) ||
      student.s_id?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <Navigation role="admin" />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Student Management</h1>
            <p className="text-muted-foreground">Register and manage student accounts</p>
          </div>
          <Button onClick={() => setShowRegisterForm(!showRegisterForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Register New Student
          </Button>
        </div>

        {showRegisterForm && (
          <Card>
            <CardHeader>
              <CardTitle>Register New Student</CardTitle>
              <CardDescription>Create a new student account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegisterStudent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="s_id">Student ID</Label>
                    <Input
                      id="s_id"
                      placeholder="e.g., SCS0001 (S + branch + 4 digits)"
                      value={formData.s_id}
                      onChange={(e) => setFormData({ ...formData, s_id: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Format: S[Branch][Number] (e.g., SCS0001, SEE0002)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="john123 (min 5 chars)"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min 8 chars, 1 upper, 1 lower, 1 number, 1 special"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role1">Year</Label>
                    <select
                      id="role1"
                      className="w-full rounded-md border p-2"
                      value={formData.role1}
                      onChange={(e) => setFormData({ ...formData, role1: e.target.value })}
                      required
                    >
                      <option value="1yr">1st Year</option>
                      <option value="2yr">2nd Year</option>
                      <option value="3yr">3rd Year</option>
                      <option value="4yr">4th Year</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role2">Branch</Label>
                    <select
                      id="role2"
                      className="w-full rounded-md border p-2"
                      value={formData.role2}
                      onChange={(e) => setFormData({ ...formData, role2: e.target.value })}
                      required
                    >
                      <option value="cs">Computer Science (CS)</option>
                      <option value="ee">Electrical Engineering (EE)</option>
                      <option value="me">Mechanical Engineering (ME)</option>
                      <option value="ce">Civil Engineering (CE)</option>
                    </select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="role3">Student Type</Label>
                    <select
                      id="role3"
                      className="w-full rounded-md border p-2"
                      value={formData.role3}
                      onChange={(e) => setFormData({ ...formData, role3: e.target.value })}
                      required
                    >
                      <option value="none">Regular</option>
                      <option value="skilled">Skilled</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Register Student</Button>
                  <Button type="button" variant="outline" onClick={() => setShowRegisterForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {showEditDialog && editingStudent && (
          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Edit Credentials - {editingStudent.name}
              </CardTitle>
              <CardDescription>
                Student ID: <Badge variant="outline">{editingStudent.s_id}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateCredentials} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    placeholder="Enter new username"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Minimum 5 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="Enter new password"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Min 8 chars: 1 uppercase, 1 lowercase, 1 number, 1 special character
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Update Credentials</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowEditDialog(false);
                      setEditingStudent(null);
                      setEditFormData({ username: '', password: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Registered Students ({filteredStudents.length})</CardTitle>
                <CardDescription>View and manage all registered students</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No students found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredStudents.map((student) => {
                    const studentRecord = studentRecords[student.s_id];
                    const imageUrl = studentRecord?.image ? resolveAssetUrl(studentRecord.image) : '/defaultProfile.svg';
                    
                    return (
                      <Card key={student.s_id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-start">
                            {/* Profile Image */}
                            <div className="flex-shrink-0">
                              <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img 
                                  src={imageUrl} 
                                  alt={student.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = '/defaultProfile.svg';
                                  }}
                                />
                              </div>
                              {studentRecord?.image && (
                                <p className="text-xs text-center mt-1 text-green-600">✓ Photo</p>
                              )}
                            </div>
                            
                            {/* Student Info */}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg capitalize">{student.name}</h3>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                                <span className="flex items-center gap-1">
                                  <Badge variant="outline" className="font-mono">{student.s_id?.toUpperCase()}</Badge>
                                </span>
                                <span className="font-medium">Username: <span className="text-primary">@{student.username}</span></span>
                                {student.role && student.role.length > 0 && (
                                  <>
                                    {student.role[2] && <Badge variant="secondary">{student.role[2]}</Badge>}
                                    {student.role[3] && <Badge variant="secondary">{student.role[3]}</Badge>}
                                  </>
                                )}
                              </div>
                              {studentRecord && (
                                <div className="text-sm text-muted-foreground mt-2">
                                  <p><strong>Email:</strong> {studentRecord.gmail || 'N/A'}</p>
                                  <p><strong>Phone:</strong> {studentRecord.contact || 'N/A'}</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(student)}
                                className="gap-1"
                              >
                                <Key className="h-4 w-4" />
                                Edit Credentials
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteStudent(student.s_id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
