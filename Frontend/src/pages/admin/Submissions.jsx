import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { FileText, Check, X, Eye, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { adminAPI } from '../lib/backend-api';

export default function AdminSubmissions() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [feedback, setFeedback] = useState('');

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

    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUploadRequests();
      console.log('Submission requests response:', response);
      setRequests(response.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load submission requests');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRequest = async (v_id, status, feedback = '') => {
    try {
      await adminAPI.verifyRequest(v_id, { status, feedback });
      toast.success(`Request ${status === 'accepted' ? 'accepted' : 'rejected'}!`);
      setShowDetailDialog(false);
      setFeedback('');
      fetchRequests();
    } catch (error) {
      toast.error(error.message || 'Failed to update request');
    }
  };

  const openDetailDialog = (request) => {
    setSelectedRequest(request);
    setShowDetailDialog(true);
    setFeedback('');
  };

  const handleViewProof = (v_id) => {
    const proofUrl = adminAPI.getProofUrl(v_id);
    window.open(proofUrl, '_blank');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      skills: '🛠️',
      result: '📊',
      certificate: '🏆',
      project: '💻',
      internship: '💼'
    };
    return icons[category] || '📄';
  };

  const renderBodyDetails = (category, body) => {
    if (!body) return null;

    switch(category) {
      case 'skills':
        return (
          <div className="space-y-2">
            <p><span className="font-medium">Skill Name:</span> {body.name}</p>
            <p><span className="font-medium">Topics:</span> {body.topics?.join(', ')}</p>
          </div>
        );
      case 'result':
        return (
          <div className="space-y-2">
            <p><span className="font-medium">Result Name:</span> {body.name}</p>
            <p><span className="font-medium">Roll No:</span> {body.r_no}</p>
            <p><span className="font-medium">Score:</span> {body.score}%</p>
            {body.image && (
              <a href={body.image} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                View Result Image <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        );
      case 'certificate':
        return (
          <div className="space-y-2">
            <p><span className="font-medium">Certificate Name:</span> {body.name}</p>
            <p><span className="font-medium">Certificate ID:</span> {body.c_id}</p>
            {body.image && (
              <a href={body.image} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                View Certificate Image <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        );
      case 'project':
        return (
          <div className="space-y-2">
            <p><span className="font-medium">Project Name:</span> {body.name}</p>
            <p><span className="font-medium">Description:</span> {body.description}</p>
            <p><span className="font-medium">Technologies:</span> {body.technology?.join(', ')}</p>
            {body.url && (
              <a href={body.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                View Project <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {body.image && (
              <a href={body.image} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                View Project Image <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        );
      case 'internship':
        return (
          <div className="space-y-2">
            <p><span className="font-medium">Field:</span> {body.field}</p>
            <p><span className="font-medium">Company:</span> {body.company}</p>
            <p><span className="font-medium">Duration:</span> {body.duration} months</p>
            {body.certificate && (
              <a href={body.certificate} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                View Certificate <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        );
      default:
        return <pre className="text-sm">{JSON.stringify(body, null, 2)}</pre>;
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <Navigation role="admin" />
      
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Submission Verification</h1>
          <p className="text-muted-foreground">Review and approve student activity submissions</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('all')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('pending')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Eye className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('accepted')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                  <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('rejected')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <X className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {filter === 'all' ? 'All Requests' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Requests`}
              {' '}({filteredRequests.length})
            </CardTitle>
            <CardDescription>Review student activity submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No requests found</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <Card key={request.v_id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getCategoryIcon(request.category)}</span>
                            <h3 className="font-semibold text-lg capitalize">{request.category}</h3>
                            <Badge variant={
                              request.status === 'accepted' ? 'default' :
                              request.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }>
                              {request.status}
                            </Badge>
                          </div>
                          
                          {request.message && (
                            <p className="text-muted-foreground mb-3 text-sm italic">"{request.message}"</p>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="font-medium">Student ID:</span> {request.s_id}
                            </div>
                            <div>
                              <span className="font-medium">Verification ID:</span> {request.v_id}
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span> {new Date(request.creation_date).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Category:</span> <span className="capitalize">{request.category}</span>
                            </div>
                          </div>

                          <div className="mt-3 p-3 bg-muted/50 rounded-md text-sm">
                            {renderBodyDetails(request.category, request.body)}
                          </div>

                          {request.feedback && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-sm"><span className="font-medium">Admin Feedback:</span> {request.feedback}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          {request.proof && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProof(request.v_id)}
                              className="gap-2 bg-blue-50 hover:bg-blue-100"
                            >
                              <Download className="h-4 w-4" />
                              View Proof
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailDialog(request)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          
                          {request.status === 'pending' && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleVerifyRequest(request.v_id, 'accepted')}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                                Accept
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDetailDialog(request)}
                                className="gap-2"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {request.status === 'accepted' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyRequest(request.v_id, 'pending')}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Set Pending
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDetailDialog(request)}
                                className="gap-2"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {request.status === 'rejected' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyRequest(request.v_id, 'pending')}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Set Pending
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => openDetailDialog(request)}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                                Accept
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedRequest && getCategoryIcon(selectedRequest.category)}</span>
              Request Details - {selectedRequest?.category && selectedRequest.category.charAt(0).toUpperCase() + selectedRequest.category.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Verification ID: {selectedRequest?.v_id} | Student: {selectedRequest?.s_id}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                <Badge variant={
                  selectedRequest.status === 'accepted' ? 'default' :
                  selectedRequest.status === 'rejected' ? 'destructive' :
                  'secondary'
                }>
                  {selectedRequest.status}
                </Badge>
              </div>

              {selectedRequest.message && (
                <div>
                  <h4 className="font-semibold mb-2">Student Message</h4>
                  <p className="text-sm p-3 bg-muted rounded-md">{selectedRequest.message}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Achievement Details</h4>
                <div className="p-4 bg-muted/50 rounded-md">
                  {renderBodyDetails(selectedRequest.category, selectedRequest.body)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Submission Date</h4>
                <p className="text-sm">{new Date(selectedRequest.creation_date).toLocaleString()}</p>
              </div>

              {selectedRequest.proof && (
                <div>
                  <h4 className="font-semibold mb-2">Proof Document</h4>
                  <Button
                    variant="outline"
                    onClick={() => handleViewProof(selectedRequest.v_id)}
                    className="gap-2 w-full bg-blue-50 hover:bg-blue-100"
                  >
                    <Download className="h-4 w-4" />
                    View/Download Proof Document
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Click to view the proof document uploaded by the student
                  </p>
                </div>
              )}

              {selectedRequest.feedback && (
                <div>
                  <h4 className="font-semibold mb-2">Previous Feedback</h4>
                  <p className="text-sm p-3 bg-yellow-50 border border-yellow-200 rounded-md">{selectedRequest.feedback}</p>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label htmlFor="feedback" className="font-semibold block mb-2">
                    {selectedRequest.status === 'pending' 
                      ? 'Add Feedback (Optional for Acceptance, Required for Rejection)'
                      : 'Update Feedback (Optional)'}
                  </label>
                  <textarea
                    id="feedback"
                    className="w-full p-3 border rounded-md min-h-[100px] text-sm"
                    placeholder="Provide feedback for the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{feedback.length}/1000 characters</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {selectedRequest.status === 'pending' && (
                    <>
                      <Button
                        variant="default"
                        onClick={() => handleVerifyRequest(selectedRequest.v_id, 'accepted', feedback)}
                        className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Accept Request
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (!feedback.trim()) {
                            toast.error('Please provide feedback for rejection');
                            return;
                          }
                          handleVerifyRequest(selectedRequest.v_id, 'rejected', feedback);
                        }}
                        className="flex-1 gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject Request
                      </Button>
                    </>
                  )}
                  
                  {selectedRequest.status === 'accepted' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleVerifyRequest(selectedRequest.v_id, 'pending', feedback)}
                        className="flex-1 gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Set to Pending
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (!feedback.trim()) {
                            toast.error('Please provide feedback for rejection');
                            return;
                          }
                          handleVerifyRequest(selectedRequest.v_id, 'rejected', feedback);
                        }}
                        className="flex-1 gap-2"
                      >
                        <X className="h-4 w-4" />
                        Change to Rejected
                      </Button>
                    </>
                  )}
                  
                  {selectedRequest.status === 'rejected' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleVerifyRequest(selectedRequest.v_id, 'pending', feedback)}
                        className="flex-1 gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Set to Pending
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleVerifyRequest(selectedRequest.v_id, 'accepted', feedback)}
                        className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Change to Accepted
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
