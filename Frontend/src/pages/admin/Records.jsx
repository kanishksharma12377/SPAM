import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { FileText, Search, User, Eye, Award, Briefcase, GraduationCap, Code, Trophy, Edit, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { adminAPI, resolveAssetUrl } from '../lib/backend-api';

export default function AdminRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    gmail: '',
    contact: '',
    category: '',
    profile: '',
    points: 0
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

    fetchRecords();
  }, [navigate]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRecordsList();
      console.log('Records response:', response);
      setRecords(response.records || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load student records');
    } finally {
      setLoading(false);
    }
  };

  const viewStudentRecord = async (s_id) => {
    try {
      setDetailLoading(true);
      setShowDetailDialog(true);
      const response = await adminAPI.getStudentRecord(s_id);
      console.log('Student record:', response.record);
      setSelectedRecord(response.record);
    } catch (error) {
      console.error('Error loading student record:', error);
      toast.error('Failed to load student record');
      setShowDetailDialog(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const openEditDialog = (record) => {
    setEditForm({
      gmail: record.gmail || '',
      contact: record.contact || '',
      category: record.category || 'gen',
      profile: record.profile || '',
      points: record.points || 0
    });
    setShowEditDialog(true);
  };

  const handleEditRecord = async (e) => {
    e.preventDefault();
    
    if (!selectedRecord?.s_id) {
      toast.error('No student selected');
      return;
    }

    // Build update object with only changed fields
    const updates = {};
    if (editForm.gmail && editForm.gmail !== selectedRecord.gmail) {
      updates.gmail = editForm.gmail;
    }
    if (editForm.contact && editForm.contact !== selectedRecord.contact) {
      updates.contact = editForm.contact;
    }
    if (editForm.category && editForm.category !== selectedRecord.category) {
      updates.category = editForm.category;
    }
    if (editForm.profile !== selectedRecord.profile) {
      updates.profile = editForm.profile;
    }
    if (editForm.points !== selectedRecord.points) {
      updates.points = parseInt(editForm.points) || 0;
    }

    if (Object.keys(updates).length === 0) {
      toast.info('No changes to save');
      return;
    }

    setEditSaving(true);
    try {
      await adminAPI.updateStudentRecord(selectedRecord.s_id, updates);
      toast.success('Record updated successfully!');
      setShowEditDialog(false);
      
      // Refresh the record
      const response = await adminAPI.getStudentRecord(selectedRecord.s_id);
      setSelectedRecord(response.record);
      
      // Refresh the records list
      fetchRecords();
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error(error.message || 'Failed to update record');
    } finally {
      setEditSaving(false);
    }
  };

  const filteredRecords = records.filter(record =>
    record.name?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.name?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.s_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <Navigation role="admin" />
      
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Student Records</h1>
          <p className="text-muted-foreground">View detailed student profiles and achievements</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>All Student Records ({filteredRecords.length})</CardTitle>
                <CardDescription>Detailed student information and portfolios</CardDescription>
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
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No student records found</p>
                  <p className="text-sm text-muted-foreground mt-2">Students need to complete their profile setup first</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredRecords.map((record) => (
                    <Card key={record.s_id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex gap-4 flex-1">
                            <div className="h-20 w-16 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 flex-shrink-0">
                              <img
                                src={record.image ? resolveAssetUrl(record.image) : '/defaultProfile.svg'}
                                alt={`${record.name?.firstName} ${record.name?.lastName}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/defaultProfile.svg';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {record.name?.firstName} {record.name?.middleName} {record.name?.lastName}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                                <div><span className="font-medium">ID:</span> {record.s_id}</div>
                                <div><span className="font-medium">Age:</span> {record.age}</div>
                                <div><span className="font-medium">Contact:</span> {record.contact}</div>
                                <div><span className="font-medium">Email:</span> {record.gmail}</div>
                                <div><span className="font-medium">Gender:</span> {record.gender}</div>
                                <div><span className="font-medium">Category:</span> {record.category || 'N/A'}</div>
                              </div>
                              {record.about && (
                                <p className="mt-3 text-sm text-muted-foreground">{record.about}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewStudentRecord(record.s_id)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Student Record Details
            </DialogTitle>
            <DialogDescription>
              Complete portfolio and achievement details
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading student record...</p>
              </div>
            </div>
          ) : selectedRecord ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(selectedRecord)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Record
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-sm font-semibold">
                        {selectedRecord.name?.firstName} {selectedRecord.name?.middleName} {selectedRecord.name?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                      <p className="text-sm font-semibold">{selectedRecord.s_id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Age</p>
                      <p className="text-sm">{selectedRecord.age}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p className="text-sm capitalize">{selectedRecord.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact</p>
                      <p className="text-sm">{selectedRecord.contact}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{selectedRecord.gmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Category</p>
                      <p className="text-sm">{selectedRecord.category || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                      <p className="text-sm font-bold text-primary">{selectedRecord.points || 0}</p>
                    </div>
                  </div>
                  {selectedRecord.about && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">About</p>
                      <p className="text-sm p-3 bg-muted/50 rounded-md">{selectedRecord.about}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {selectedRecord.skills && selectedRecord.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedRecord.skills.map((skill, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-md">
                          <p className="font-semibold text-sm">{skill.name}</p>
                          {skill.topics && skill.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {skill.topics.map((topic, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certificates */}
              {selectedRecord.certificate && selectedRecord.certificate.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Certificates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedRecord.certificate.map((cert, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-md">
                          <p className="font-semibold text-sm">{cert.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">Certificate ID: {cert.c_id}</p>
                          {cert.image && (
                            <a 
                              href={cert.image} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-1 inline-block"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {selectedRecord.result && selectedRecord.result.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Academic Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedRecord.result.map((result, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm">{result.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">Roll No: {result.r_no}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              {result.score}%
                            </Badge>
                          </div>
                          {result.image && (
                            <a 
                              href={result.image} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-2 inline-block"
                            >
                              View Result
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Projects */}
              {selectedRecord.project && selectedRecord.project.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedRecord.project.map((project, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-md">
                          <p className="font-semibold text-sm">{project.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                          {project.technology && project.technology.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.technology.map((tech, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            {project.url && (
                              <a 
                                href={project.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                View Project
                              </a>
                            )}
                            {project.image && (
                              <a 
                                href={project.image} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                View Image
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Internships */}
              {selectedRecord.internship && selectedRecord.internship.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Internships
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedRecord.internship.map((internship, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm">{internship.field}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {internship.company} • {internship.duration} months
                              </p>
                            </div>
                          </div>
                          {internship.certificate && (
                            <a 
                              href={internship.certificate} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-2 inline-block"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Summary Card */}
              <Card className="bg-primary/5">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{selectedRecord.points || 0}</p>
                      <p className="text-xs text-muted-foreground">Total Points</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{selectedRecord.skills?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Skills</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{selectedRecord.certificate?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Certificates</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{selectedRecord.project?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{selectedRecord.internship?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Internships</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No record data available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit Student Record
            </DialogTitle>
            <DialogDescription>
              Update student information. Some fields are editable by admin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditRecord} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-gmail">Email (Gmail)</Label>
              <Input
                id="edit-gmail"
                type="email"
                value={editForm.gmail}
                onChange={(e) => setEditForm(prev => ({ ...prev, gmail: e.target.value }))}
                placeholder="student@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact Number</Label>
              <Input
                id="edit-contact"
                type="text"
                value={editForm.contact}
                onChange={(e) => setEditForm(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="10-digit phone number"
                pattern="[0-9]{10}"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                value={editForm.category}
                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border rounded-md p-2"
              >
                <option value="gen">General</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-points">Total Points</Label>
              <Input
                id="edit-points"
                type="number"
                min="0"
                value={editForm.points}
                onChange={(e) => setEditForm(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-profile">About / Profile</Label>
              <textarea
                id="edit-profile"
                value={editForm.profile}
                onChange={(e) => setEditForm(prev => ({ ...prev, profile: e.target.value }))}
                className="w-full border rounded-md p-2 min-h-[100px]"
                placeholder="Brief description about the student..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {editSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
