import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Shield, User, AlertCircle, CheckCircle2, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { authAPI, DEMO_MODE, DEMO_CREDENTIALS, resetDemoData } from './lib/backend-api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialUserType = searchParams.get('type') || 'student';
  
  const [selectedUserType, setSelectedUserType] = useState(initialUserType);
  // eslint-disable-next-line no-unused-vars
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await authAPI.login(loginData.username, loginData.password, selectedUserType);
      
      console.log('Login response:', response);
      
      if (response.success) {
        const userData = {
          ...response.user,
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('Stored userData:', userData);
        
        setSuccess('Login successful! Redirecting...');
        
        // Add small delay to ensure localStorage is set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check role (backend returns role as array for students, string for admin)
        const userRole = Array.isArray(response.user.role) ? response.user.role[0] : response.user.role;
        console.log('User role:', userRole, 'Setup:', response.user.setup);
        
        // Check if student needs to setup profile
        if (userRole === 'student' && !response.user.setup) {
          console.log('Redirecting to student setup...');
          navigate('/student/setup', { replace: true });
        } else if (userRole === 'admin') {
          console.log('Redirecting to admin dashboard...');
          navigate('/admin/dashboard', { replace: true });
        } else if (userRole === 'student') {
          console.log('Redirecting to student dashboard...');
          navigate('/student/dashboard', { replace: true });
        }
      }
    } catch (error) {
      setError(error.message || 'Invalid username or password. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo-mode helpers: prefill a seeded account, or restore the seed dataset.
  const fillDemoAccount = (type) => {
    const { username, password } = DEMO_CREDENTIALS[type];
    setSelectedUserType(type);
    setLoginData({ username, password });
    setError('');
    setSuccess('');
  };

  const handleResetDemoData = () => {
    resetDemoData();
    localStorage.removeItem('userData');
    setLoginData({ username: '', password: '' });
    setError('');
    setSuccess('Demo data restored to its original state.');
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex">
        <div className="flex w-full h-screen">
          {/* Left branding area with illustration */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10 p-12">
            <div className="w-full max-w-4xl h-full flex flex-col lg:flex-row items-start lg:items-center gap-8">
              <div className="flex-1 text-left space-y-6">
                <h2 className="text-7xl font-extrabold text-primary leading-tight drop-shadow-sm">SPAM</h2>
                <p className="text-2xl text-foreground/90 leading-relaxed font-medium">
                  SPAM reduces effort and boosts productivity by centralizing student achievements and portfolios.
                  Easily verify accomplishments, monitor milestones, and approve submissions from a single, intuitive dashboard.
                </p>
              </div>

              <div className="flex-none w-full lg:w-1/2 h-80 lg:h-[75vh] flex items-center justify-center lg:justify-end">
                <img src="/login_1.png" alt="Student using SPAM platform" className="w-full h-full object-contain drop-shadow-xl"/>
              </div>
            </div>
          </div>

          {/* Right login card */}
          <div className="w-full lg:w-[480px] p-8 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <Card className="w-full shadow-2xl border-2">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold text-primary">
                  {selectedUserType === 'admin' ? 'Admin Portal' : selectedUserType === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                </CardTitle>
                <CardDescription className="text-base">
                  Access your {selectedUserType} dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Toggle Switch for User Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Sign in as</Label>
                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                      <button
                        type="button"
                        onClick={() => setSelectedUserType('student')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${
                          selectedUserType === 'student'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span className="font-medium">Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUserType('admin')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${
                          selectedUserType === 'admin'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Admin</span>
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Success Message */}
                  {success && (
                    <Alert className="border-green-500 bg-green-50 text-green-900 animate-in slide-in-from-top-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Enter your username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : `Login as ${selectedUserType}`}
                    </Button>
                  </form>

                  {DEMO_MODE && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Demo accounts
                        </p>
                        <button
                          type="button"
                          onClick={handleResetDemoData}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Reset data
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => fillDemoAccount('student')}
                          className="rounded-md border p-2.5 text-left hover:bg-muted hover:border-primary/40 transition-colors"
                        >
                          <span className="flex items-center gap-1.5 text-xs font-medium">
                            <User className="h-3 w-3" />
                            Student
                          </span>
                          <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
                            {DEMO_CREDENTIALS.student.username} / {DEMO_CREDENTIALS.student.password}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fillDemoAccount('admin')}
                          className="rounded-md border p-2.5 text-left hover:bg-muted hover:border-primary/40 transition-colors"
                        >
                          <span className="flex items-center gap-1.5 text-xs font-medium">
                            <Shield className="h-3 w-3" />
                            Admin
                          </span>
                          <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
                            {DEMO_CREDENTIALS.admin.username} / {DEMO_CREDENTIALS.admin.password}
                          </span>
                        </button>
                      </div>

                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Running on in-browser demo data — no database required. Changes you make are
                        saved to this browser only.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
