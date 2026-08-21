import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { User, Mail, Lock, Edit, Save, Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { adminAPI } from '../lib/backend-api';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
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

    fetchProfileData();
  }, [navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      const profileRes = await adminAPI.getProfile();
      console.log('Admin profile response:', profileRes);
      
      setProfile(profileRes.admin || {});
      
      // Initialize edit form
      setEditForm({
        name: profileRes.admin?.name || '',
        username: profileRes.admin?.username || ''
      });
      
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      toast.error(error.message || 'Failed to load profile data');
      setProfile({});
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
      await adminAPI.updateProfile(updates);
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
    
    // Validate password requirements
    if (passwordForm.password.length < 8 || passwordForm.password.length > 15) {
      toast.error('Password must be 8-15 characters long');
      return;
    }
    
    if (!/[A-Z]/.test(passwordForm.password)) {
      toast.error('Password must include at least one uppercase letter');
      return;
    }
    
    if (!/[a-z]/.test(passwordForm.password)) {
      toast.error('Password must include at least one lowercase letter');
      return;
    }
    
    if (!/[0-9]/.test(passwordForm.password)) {
      toast.error('Password must include at least one number');
      return;
    }
    
    if (!/[^A-Za-z0-9]/.test(passwordForm.password)) {
      toast.error('Password must include at least one special character (!@#$%^&*, etc.)');
      return;
    }
    
    setIsSaving(true);
    try {
      await adminAPI.updateProfile({ password: passwordForm.password });
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
        <Navigation role="admin" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || 'Admin';
  const displayUsername = profile?.username || profile?.a_id || 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation role="admin" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
          <p className="text-gray-600">View and manage your admin account</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Admin Account
                </CardTitle>
                <CardDescription>Your admin credentials and information</CardDescription>
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
                    <DialogTitle>Edit Admin Profile</DialogTitle>
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
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Profile Avatar */}
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                  <img 
                    src="/admin-default-avatar.svg" 
                    alt="Admin Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-bold';
                      fallback.textContent = 'A';
                      e.target.parentNode.appendChild(fallback);
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{displayName}</h2>
                  <p className="text-muted-foreground">Administrator</p>
                </div>
              </div>
              
              {/* Account Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{displayUsername}</p>
                  </div>
                </div>
                
                {profile?.a_id && (
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Admin ID</p>
                      <p className="font-medium">{profile.a_id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your password and account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Change your account password</p>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setIsPasswordDialogOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-colors"
              >
                Change Password
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Dialog */}
        {isPasswordDialogOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Enter a new password for your admin account. Use a strong password with at least 8 characters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-gray-700 space-y-1">
                      <p className="font-semibold text-blue-900">Password Requirements:</p>
                      <p className={passwordForm.password.length >= 8 && passwordForm.password.length <= 15 ? 'text-green-700 font-medium' : 'text-gray-600'}>
                        • 8-15 characters
                      </p>
                      <p className={/[A-Z]/.test(passwordForm.password) ? 'text-green-700 font-medium' : 'text-gray-600'}>
                        • At least one uppercase letter (A-Z)
                      </p>
                      <p className={/[a-z]/.test(passwordForm.password) ? 'text-green-700 font-medium' : 'text-gray-600'}>
                        • At least one lowercase letter (a-z)
                      </p>
                      <p className={/[0-9]/.test(passwordForm.password) ? 'text-green-700 font-medium' : 'text-gray-600'}>
                        • At least one number (0-9)
                      </p>
                      <p className={/[^A-Za-z0-9]/.test(passwordForm.password) ? 'text-green-700 font-medium' : 'text-gray-600'}>
                        • At least one special character (!@#$%^&*, etc.)
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                      minLength={8}
                      maxLength={15}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsPasswordDialogOpen(false);
                        setPasswordForm({ password: '', confirmPassword: '' });
                        setShowPassword(false);
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSaving || passwordForm.password.length < 8 || passwordForm.password !== passwordForm.confirmPassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSaving ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
