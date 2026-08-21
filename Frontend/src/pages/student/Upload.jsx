import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Upload, Trash2, Clock, CheckCircle, XCircle, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { studentAPI } from '../lib/backend-api';

export default function StudentUpload() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    date: '',
    additionalInfo: ''
  });

  useEffect(() => {
    // Check if user is logged in and setup is complete
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

    fetchUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getUploads();
      setUploads(response.requests || []);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      
      // Handle specific errors
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
      
      toast.error(error.message || 'Failed to load uploads');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only images (JPEG, PNG, GIF, WEBP) and PDF files are allowed.');
        e.target.value = '';
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      setProofFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setProofPreview('pdf');
      }
    }
  };

  const clearProofFile = () => {
    setProofFile(null);
    setProofPreview(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!proofFile) {
      toast.error('Please upload a proof document (image or PDF)');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare upload data using FormData for file upload
      const formDataToSend = new FormData();
      
      // Add the proof file
      formDataToSend.append('proof', proofFile);
      
      // Add category
      formDataToSend.append('category', formData.category);
      
      // Prepare body based on category
      const bodyData = {
        name: formData.title,
        description: formData.description,
        date: formData.date,
        ...(formData.category === 'skills' && { topics: formData.additionalInfo ? formData.additionalInfo.split(',').map(t => t.trim()) : [] }),
        ...(formData.category === 'result' && { score: formData.additionalInfo, r_no: 'N/A' }),
        ...(formData.category === 'certificate' && { c_id: formData.additionalInfo || 'N/A' }),
        ...(formData.category === 'project' && { technology: formData.additionalInfo ? formData.additionalInfo.split(',').map(t => t.trim()) : [], link: '' }),
        ...(formData.category === 'internship' && { company: formData.title, field: formData.description, duration: parseInt(formData.additionalInfo) || 0 })
      };
      
      // Add body as JSON string
      formDataToSend.append('body', JSON.stringify(bodyData));
      
      // Add message
      if (formData.description) {
        formDataToSend.append('message', formData.description);
      }

      await studentAPI.createUpload(formDataToSend);
      toast.success('Activity submitted successfully! Waiting for admin approval.');
      
      // Reset form
      setFormData({
        category: '',
        title: '',
        description: '',
        date: '',
        additionalInfo: ''
      });
      clearProofFile();
      
      // Refresh uploads list
      fetchUploads();
    } catch (error) {
      console.error('Error submitting upload:', error);
      toast.error(error.message || 'Failed to submit activity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (v_id) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await studentAPI.deleteUpload(v_id);
      toast.success('Request deleted successfully');
      fetchUploads();
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast.error(error.message || 'Failed to delete request');
    }
  };

  const handleViewProof = (v_id) => {
    const proofUrl = studentAPI.getProofUrl(v_id);
    window.open(proofUrl, '_blank');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      skills: 'Skill',
      result: 'Result',
      certificate: 'Certificate',
      project: 'Project',
      internship: 'Internship'
    };
    return labels[category] || category;
  };

  const getAdditionalFieldLabel = () => {
    switch (formData.category) {
      case 'skills':
        return 'Topics (comma-separated)';
      case 'result':
        return 'Score/Grade';
      case 'certificate':
        return 'Certificate ID (optional)';
      case 'project':
        return 'Technologies (comma-separated)';
      case 'internship':
        return 'Duration (months)';
      default:
        return 'Additional Information';
    }
  };

  return (
    <>
      <Navigation role="student" />
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link to="/student/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-primary mb-2">Upload Activity</h1>
            <p className="text-muted-foreground">Submit your achievements for verification</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  New Activity
                </CardTitle>
                <CardDescription>Fill in the details of your activity</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2" 
                      required
                    >
                      <option value="">Select category</option>
                      <option value="skills">Skills</option>
                      <option value="result">Academic Result</option>
                      <option value="certificate">Certificate</option>
                      <option value="project">Project</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {formData.category === 'internship' ? 'Company Name *' : 'Title *'}
                    </label>
                    <input 
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2" 
                      placeholder={formData.category === 'internship' ? 'e.g., Google' : 'e.g., Google Summer of Code 2024'}
                      required 
                    />
                  </div>

                  {formData.category && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {getAdditionalFieldLabel()}
                      </label>
                      <input 
                        type="text"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2" 
                        placeholder={
                          formData.category === 'skills' ? 'e.g., React, Node.js, MongoDB' :
                          formData.category === 'result' ? 'e.g., 95% or 9.5 CGPA' :
                          formData.category === 'certificate' ? 'e.g., CERT123456' :
                          formData.category === 'project' ? 'e.g., React, Express, MongoDB' :
                          formData.category === 'internship' ? 'e.g., 6' : ''
                        }
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input 
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2" 
                      rows="4"
                      placeholder="Provide details about your activity..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Proof Document * (Image or PDF)
                    </label>
                    <input 
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className="w-full border rounded-md p-2"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload proof of your achievement (Max 5MB, Images or PDF only)
                    </p>
                    
                    {proofPreview && (
                      <div className="mt-3 relative">
                        {proofPreview === 'pdf' ? (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h10l4 4v16H2v-1z"/>
                            </svg>
                            <div>
                              <p className="text-sm font-medium">{proofFile?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(proofFile?.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={clearProofFile}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <img 
                              src={proofPreview} 
                              alt="Proof preview" 
                              className="max-h-48 rounded-md border"
                            />
                            <button
                              type="button"
                              onClick={clearProofFile}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Activity'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Uploads List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Submissions</h2>
              
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Loading submissions...</p>
                  </CardContent>
                </Card>
              ) : uploads.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No submissions yet. Submit your first activity!</p>
                  </CardContent>
                </Card>
              ) : (
                uploads.map((upload) => (
                  <Card key={upload.v_id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(upload.status)}
                          <div>
                            <h4 className="font-semibold">{upload.body?.name || upload.body?.company || 'Untitled'}</h4>
                            <p className="text-sm text-muted-foreground">{getCategoryLabel(upload.category)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(upload.status)}
                          {upload.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(upload.v_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {upload.message && (
                        <p className="text-sm text-muted-foreground mb-2">{upload.message}</p>
                      )}
                      
                      {upload.proof && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProof(upload.v_id)}
                          className="mb-2"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Proof
                        </Button>
                      )}
                      
                      {upload.feedback && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium mb-1">Admin Feedback:</p>
                          <p className="text-sm">{upload.feedback}</p>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {new Date(upload.creation_date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
