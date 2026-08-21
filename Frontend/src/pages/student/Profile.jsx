import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { User, Mail, Lock, Edit, Save, X, Eye, EyeOff, Key } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { studentAPI, resolveAssetUrl } from '../lib/backend-api';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Edit form states
  const [editForm, setEditForm] = useState({
    name: '',
    username: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login?type=student');
      return;
    }

    const user = JSON.parse(userData);
    if (!user.setup) {
      toast.error('Please complete your profile setup first');
      navigate('/student/setup');
      return;
    }

    fetchProfileData();
  }, [navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      const [profileRes, recordRes] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getRecord()
      ]);
      
      console.log('Profile response:', profileRes);
      console.log('Student data:', profileRes.student);
      
      // Always set profile even if it's undefined - we'll handle it in render
      setProfile(profileRes.student || {});
      setRecord(recordRes.record || {});
      
      // Initialize edit form - handle both string and object name formats
      const nameValue = typeof profileRes.student?.name === 'object' 
        ? `${profileRes.student.name.firstName || ''} ${profileRes.student.name.middleName || ''} ${profileRes.student.name.lastName || ''}`.trim()
        : profileRes.student?.name || '';
      
      setEditForm({
        name: nameValue,
        username: profileRes.student?.username || ''
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(error.message || 'Failed to load profile data');
      // Set empty profile so page can still render
      setProfile({});
      setRecord({});
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    
    // Validate at least one field is being updated
    const updates = {};
    if (editForm.name && editForm.name !== profile.name) {
      updates.name = editForm.name;
    }
    if (editForm.username && editForm.username !== profile.username) {
      updates.username = editForm.username;
    }
    
    if (Object.keys(updates).length === 0) {
      toast.info('No changes to save');
      return;
    }
    
    setIsSaving(true);
    try {
      await studentAPI.updateProfile(updates);
      toast.success('Profile updated successfully!');
      setIsEditDialogOpen(false);
      
      // Refresh profile data
      await fetchProfileData();
      
      // Update localStorage if username changed
      if (updates.username) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        userData.username = updates.username;
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.password) {
      toast.error('Please enter a new password');
      return;
    }
    
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordForm.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setIsSaving(true);
    try {
      await studentAPI.updateProfile({ password: passwordForm.password });
      toast.success('Password changed successfully!');
      setIsPasswordDialogOpen(false);
      setPasswordForm({ password: '', confirmPassword: '' });
      setShowPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation role="student" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Remove the null check - just render with whatever data we have
  // Handle name - can be either string or object
  const displayName = typeof profile?.name === 'object'
    ? `${profile.name.firstName || ''} ${profile.name.middleName || ''} ${profile.name.lastName || ''}`.trim()
    : (profile?.name || profile?.username || 'Student');
  const displayUsername = profile?.username || profile?.s_id || 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation role="student" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">View and manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Account Information
                </CardTitle>
                <CardDescription>Your login credentials and basic information</CardDescription>
              </div>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your name and username. Changes will be saved to your account.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleEditProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        minLength={3}
                        maxLength={30}
                      />
                      <p className="text-xs text-gray-500 mt-1">3-30 characters</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter username"
                        minLength={5}
                        maxLength={20}
                      />
                      <p className="text-xs text-gray-500 mt-1">5-20 characters, lowercase</p>
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Student ID */}
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Student ID
                </Badge>
                <span className="text-gray-900 font-medium uppercase">{profile?.s_id || 'N/A'}</span>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-900 font-medium capitalize">{displayName}</p>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="text-gray-900 font-medium">{displayUsername}</p>
                </div>
              </div>
            </div>

            {/* Role */}
            {profile?.role && (
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <div className="flex gap-2 mt-1">
                    {profile.role.map((r, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Password Change Button */}
            <div className="pt-4">
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter a new password for your account. Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.password}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new password"
                          minLength={8}
                          maxLength={15}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsPasswordDialogOpen(false);
                          setPasswordForm({ password: '', confirmPassword: '' });
                          setShowPassword(false);
                        }}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        <Lock className="h-4 w-4 mr-2" />
                        {isSaving ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Personal Details Card */}
        {record && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Personal Details</CardTitle>
                  <CardDescription>Information from your student record</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate('/student/setup')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/student/portfolio')}
                  >
                    View Full Portfolio
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture Section */}
              <div className="pb-4 border-b">
                <p className="text-sm text-gray-500 mb-3">Profile Picture</p>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img 
                        src={record.image ? resolveAssetUrl(record.image) : '/defaultProfile.svg'} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/defaultProfile.svg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      {record.image ? '✓ Photo uploaded' : 'No photo uploaded'}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      To update your profile picture, click "Edit Profile" above and upload a new photo.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/student/setup')}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Upload/Change Photo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="py-2">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="text-gray-900 font-medium capitalize">
                    {`${record.name?.firstName || ''} ${record.name?.middleName || ''} ${record.name?.lastName || ''}`.trim()}
                  </p>
                </div>

                {/* Class & Branch */}
                <div className="py-2">
                  <p className="text-sm text-gray-500 mb-1">Class & Branch</p>
                  <div className="flex gap-2">
                    <Badge className="uppercase">{record.class}</Badge>
                    <Badge variant="secondary" className="uppercase">{record.branch}</Badge>
                  </div>
                </div>

                {/* Email */}
                <div className="py-2">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900">{record.gmail}</p>
                </div>

                {/* Contact */}
                <div className="py-2">
                  <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                  <p className="text-gray-900">{record.contact}</p>
                </div>

                {/* DOB & Age */}
                <div className="py-2">
                  <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-gray-900">
                    {record.dob ? new Date(record.dob).toLocaleDateString() : 'N/A'} ({record.age} years)
                  </p>
                </div>

                {/* Gender */}
                <div className="py-2">
                  <p className="text-sm text-gray-500 mb-1">Gender</p>
                  <p className="text-gray-900 capitalize">{record.gender}</p>
                </div>

                {/* Category */}
                {record.category && (
                  <div className="py-2">
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <Badge variant="outline" className="uppercase">{record.category}</Badge>
                  </div>
                )}
              </div>

              {/* Profile Bio */}
              {record.profile && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Bio</p>
                  <p className="text-gray-900 capitalize">{record.profile}</p>
                </div>
              )}

              {/* Address */}
              {record.address && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Address</p>
                  <p className="text-gray-900 capitalize">
                    {record.address.locality && `${record.address.locality}, `}
                    {record.address.city && `${record.address.city}, `}
                    {record.address.district && `${record.address.district}, `}
                    {record.address.state && `${record.address.state} - `}
                    {record.address.pincode}
                  </p>
                </div>
              )}

              {/* Father & Mother Name */}
              <div className="pt-4 border-t grid md:grid-cols-2 gap-4">
                {record.fatherName && (
                  <div className="py-2">
                    <p className="text-sm text-gray-500 mb-1">Father's Name</p>
                    <p className="text-gray-900 capitalize">{record.fatherName}</p>
                  </div>
                )}
                {record.motherName && (
                  <div className="py-2">
                    <p className="text-sm text-gray-500 mb-1">Mother's Name</p>
                    <p className="text-gray-900 capitalize">{record.motherName}</p>
                  </div>
                )}
              </div>

              {/* Achievements Summary */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-3">Achievements Summary</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{record.skills?.length || 0}</p>
                    <p className="text-xs text-gray-600">Skills</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{record.result?.length || 0}</p>
                    <p className="text-xs text-gray-600">Results</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{record.certificate?.length || 0}</p>
                    <p className="text-xs text-gray-600">Certificates</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{record.project?.length || 0}</p>
                    <p className="text-xs text-gray-600">Projects</p>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">{record.internship?.length || 0}</p>
                    <p className="text-xs text-gray-600">Internships</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
