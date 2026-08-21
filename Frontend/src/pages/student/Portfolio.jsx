import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Download, Award, BookOpen, Briefcase, Code, FileText, GraduationCap, Mail, Phone, MapPin, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../../components/Navigation';
import { studentAPI, resolveAssetUrl } from '../lib/backend-api';
import jsPDF from 'jspdf';

export default function StudentPortfolio() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

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

    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleDownloadPDF = async () => {
    try {
      toast.info('Generating PDF...');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;
      
      // Helper function to check if we need a new page
      const checkNewPage = (requiredSpace = 15) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };
      
      // Helper function to draw a card-like box
      const drawCard = (y, height, fillColor = [249, 250, 251]) => {
        doc.setFillColor(...fillColor);
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(margin, y, pageWidth - 2 * margin, height, 2, 2, 'FD');
      };
      
      // Header Section
      doc.setFillColor(59, 130, 246); // Primary blue
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('STUDENT PORTFOLIO', pageWidth / 2, 18, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Student Portfolio & Achievement Management', pageWidth / 2, 28, { align: 'center' });
      doc.setFontSize(9);
      doc.text('SPAM - Complete Academic & Achievement Tracker', pageWidth / 2, 36, { align: 'center' });
      
      yPosition = 55;
      
      // Student Information Card
      const infoCardHeight = 115;
      drawCard(yPosition, infoCardHeight, [239, 246, 255]); // Light blue background
      
      // Card Header
      doc.setTextColor(59, 130, 246);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Student Information', margin + 5, yPosition + 10);
      
      // Student Name (Large)
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(getFullName(), margin + 5, yPosition + 23);
      
      // Student ID
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Student ID: ${profile?.s_id?.toUpperCase() || 'N/A'}`, margin + 5, yPosition + 31);
      
      // Branch, Class, Points in one line
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      let infoLine = `${getBranchDisplay() || 'N/A'}`;
      doc.text(infoLine, margin + 5, yPosition + 41);
      
      doc.setTextColor(107, 114, 128);
      doc.text('•', margin + 5 + doc.getTextWidth(infoLine) + 2, yPosition + 41);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      let classText = getClassDisplay() || 'N/A';
      doc.text(classText, margin + 5 + doc.getTextWidth(infoLine) + 6, yPosition + 41);
      
      if (record?.points !== undefined) {
        doc.setTextColor(107, 114, 128);
        doc.text('•', margin + 5 + doc.getTextWidth(infoLine + classText) + 10, yPosition + 41);
        
        doc.setTextColor(59, 130, 246);
        doc.setFont('helvetica', 'bold');
        doc.text(`Points: ${record.points}`, margin + 5 + doc.getTextWidth(infoLine + classText) + 14, yPosition + 41);
      }
      
      // About/Profile
      if (profile?.profile) {
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('About', margin + 5, yPosition + 52);
        doc.setTextColor(75, 85, 99);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        const aboutLines = doc.splitTextToSize(profile.profile, pageWidth - 2 * margin - 10);
        doc.text(aboutLines.slice(0, 3), margin + 5, yPosition + 59); // Show up to 3 lines
      }
      
      // Contact Info Grid (inside the card)
      let gridY = yPosition + 75;
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      let col1X = margin + 5;
      let col2X = margin + (pageWidth - 2 * margin) / 2;
      
      if (profile?.gmail) {
        doc.text('EMAIL', col1X, gridY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(profile.gmail, col1X, gridY + 5);
        gridY += 12;
      }
      
      if (profile?.contact) {
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('CONTACT', col1X, gridY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(profile.contact, col1X, gridY + 5);
        gridY += 12;
      }
      
      // Second column
      gridY = yPosition + 75;
      if (profile?.dob) {
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('DATE OF BIRTH', col2X, gridY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(`${new Date(profile.dob).toLocaleDateString('en-IN')} (${profile.age} yrs)`, col2X, gridY + 5);
        gridY += 12;
      }
      
      if (profile?.gender) {
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('GENDER', col2X, gridY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(profile.gender.toUpperCase(), col2X, gridY + 5);
      }
      
      yPosition += infoCardHeight + 8;
      checkNewPage(20);
      
      // Skills Section
      if (record?.skills && record.skills.length > 0) {
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Skills (${record.skills.length})`, margin + 5, yPosition);
        yPosition += 8;
        
        record.skills.forEach((skill) => {
          checkNewPage(18);
          
          // Skill card
          drawCard(yPosition, 12, [255, 255, 255]);
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(skill.name.toUpperCase(), margin + 7, yPosition + 6);
          
          // Verified badge
          doc.setFillColor(34, 197, 94);
          doc.setDrawColor(34, 197, 94);
          doc.roundedRect(pageWidth - margin - 25, yPosition + 2, 20, 6, 1, 1, 'FD');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text('Verified', pageWidth - margin - 23, yPosition + 5.5);
          
          // Topics as badges
          if (skill.topic && skill.topic.length > 0) {
            let topicX = margin + 7;
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            skill.topic.slice(0, 3).forEach((topic) => {
              doc.setFillColor(243, 244, 246);
              doc.setTextColor(75, 85, 99);
              const topicWidth = doc.getTextWidth(topic) + 4;
              doc.roundedRect(topicX, yPosition + 8, topicWidth, 4, 0.5, 0.5, 'F');
              doc.text(topic, topicX + 2, yPosition + 10.5);
              topicX += topicWidth + 2;
            });
          }
          
          yPosition += 14;
        });
        
        yPosition += 3;
      }
      
      // Certifications Section
      if (record?.certificate && record.certificate.length > 0) {
        checkNewPage(20);
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Certifications (${record.certificate.length})`, margin + 5, yPosition);
        yPosition += 8;
        
        record.certificate.forEach((cert) => {
          checkNewPage(12);
          drawCard(yPosition, 10, [255, 255, 255]);
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(cert.name.toUpperCase(), margin + 7, yPosition + 5);
          
          if (cert.c_id) {
            doc.setTextColor(107, 114, 128);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.text(`ID: ${cert.c_id}`, margin + 7, yPosition + 8.5);
          }
          
          // Verified badge
          doc.setFillColor(34, 197, 94);
          doc.roundedRect(pageWidth - margin - 25, yPosition + 2, 20, 6, 1, 1, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text('Verified', pageWidth - margin - 23, yPosition + 5.5);
          
          yPosition += 12;
        });
        
        yPosition += 3;
      }
      
      // Projects Section
      if (record?.project && record.project.length > 0) {
        checkNewPage(20);
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Projects (${record.project.length})`, margin + 5, yPosition);
        yPosition += 8;
        
        record.project.forEach((project) => {
          const projectHeight = 20 + (project.description ? 8 : 0);
          checkNewPage(projectHeight);
          drawCard(yPosition, projectHeight, [255, 255, 255]);
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(project.name.toUpperCase(), margin + 7, yPosition + 6);
          
          let projectY = yPosition + 10;
          
          if (project.description) {
            doc.setTextColor(75, 85, 99);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            const descLines = doc.splitTextToSize(project.description, pageWidth - 2 * margin - 14);
            doc.text(descLines.slice(0, 2), margin + 7, projectY);
            projectY += descLines.slice(0, 2).length * 4;
          }
          
          if (project.technology && project.technology.length > 0) {
            let techX = margin + 7;
            doc.setFontSize(7);
            project.technology.slice(0, 4).forEach((tech) => {
              doc.setFillColor(239, 246, 255);
              doc.setTextColor(59, 130, 246);
              const techWidth = doc.getTextWidth(tech) + 4;
              doc.roundedRect(techX, projectY, techWidth, 4, 0.5, 0.5, 'F');
              doc.text(tech, techX + 2, projectY + 2.5);
              techX += techWidth + 2;
            });
          }
          
          yPosition += projectHeight + 2;
        });
        
        yPosition += 3;
      }
      
      // Footer
      checkNewPage(15);
      doc.setFillColor(249, 250, 251);
      doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by SPAM - Student Portfolio & Achievement Management', pageWidth / 2, pageHeight - 12, { align: 'center' });
      doc.setFontSize(7);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
      
      // Save PDF
      const fileName = `${profile?.name?.firstName || 'Student'}_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleGenerateCV = () => {
    toast.info('🎓 CV Generation feature coming soon! We\'ll create a professional resume from your portfolio data.');
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      
      const [profileRes, recordRes] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getRecord()
      ]);
      
      console.log('Profile response:', profileRes);
      console.log('Profile student data:', profileRes.student);
      console.log('Record response:', recordRes);
      
      // Always set data even if undefined - render with fallbacks
      setProfile(profileRes.student || {});
      setRecord(recordRes.record || {});
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      
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
      
      toast.error(error.message || 'Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const getFullName = () => {
    if (!profile) return 'Student';
    
    // If name is an object (from Student model)
    if (typeof profile.name === 'object' && profile.name !== null) {
      const { firstName, middleName, lastName } = profile.name;
      return [firstName, middleName, lastName].filter(Boolean).join(' ').toUpperCase();
    }
    
    // If name is a string (from Login model)
    if (typeof profile.name === 'string') {
      return profile.name.toUpperCase();
    }
    
    return 'Student';
  };

  const getClassDisplay = () => {
    const classMap = { '1yr': '1st Year', '2yr': '2nd Year', '3yr': '3rd Year', '4yr': '4th Year' };
    const classValue = profile?.role?.[2] || profile?.class;
    return classMap[classValue] || classValue || 'N/A';
  };

  const getBranchDisplay = () => {
    const branchMap = { 
      cs: 'Computer Science', 
      ce: 'Computer Engineering', 
      me: 'Mechanical Engineering', 
      ee: 'Electrical Engineering' 
    };
    const branchValue = profile?.role?.[3] || profile?.branch;
    return branchMap[branchValue] || branchValue || 'N/A';
  };

  if (loading) {
    return (
      <>
        <Navigation role="student" />
        <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Loading portfolio...</p>
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
      <Navigation role="student" />
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 back-button-container">
            <Link to="/student/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Student Portfolio</h1>
                <p className="text-muted-foreground">SPAM — Student Portfolio & Achievement Management</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 action-buttons-container">
                <Button variant="outline" className="w-fit" onClick={handleDownloadPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="w-fit" onClick={handleGenerateCV}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Generate CV
                </Button>
              </div>
            </div>
          </div>

          {/* Portfolio Content - This will be captured for PDF */}
          <div id="portfolio-content">
          {/* Student Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Profile Picture and Name Section */}
              <div className="mb-8 pb-4 border-b">
                <div className="flex gap-6 items-start">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-40 h-52 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
                      <img 
                        src={record?.image ? resolveAssetUrl(record.image) : '/defaultProfile.svg'} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/defaultProfile.svg';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Name and Basic Info */}
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-primary">{getFullName()}</p>
                    <p className="text-sm text-muted-foreground mt-1">Student ID: {profile?.s_id?.toUpperCase() || 'N/A'}</p>
                    <div className="flex gap-4 mt-3 mb-4">
                      <span className="font-semibold">{getBranchDisplay() || 'N/A'}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{getClassDisplay() || 'N/A'}</span>
                      {record?.points !== undefined && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-semibold text-primary">Points: {record.points}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name and Basic Info Header */}
              <div className="mb-6 pb-4 border-b hidden">
                <p className="text-2xl font-bold text-primary">{getFullName()}</p>
                <p className="text-sm text-muted-foreground mt-1">Student ID: {profile?.s_id?.toUpperCase() || 'N/A'}</p>
                <div className="flex gap-4 mt-2">
                  <span className="font-semibold">{getBranchDisplay() || 'N/A'}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{getClassDisplay() || 'N/A'}</span>
                  {record?.points !== undefined && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-semibold text-primary">Points: {record.points}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Profile/About */}
              {profile?.profile && (
                <div className="mb-6 pb-4 border-b">
                  <p className="text-sm font-semibold mb-2 text-primary">About</p>
                  <p className="text-sm text-muted-foreground">{profile.profile}</p>
                </div>
              )}

              {/* Detailed Information Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Contact Information */}
                {profile?.gmail && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="break-all">{profile.gmail}</span>
                    </div>
                  </div>
                )}
                {profile?.contact && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{profile.contact}</span>
                    </div>
                  </div>
                )}
                
                {/* Personal Details */}
                {profile?.dob && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                    <p className="text-sm">
                      {new Date(profile.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {profile.age && <span className="text-muted-foreground"> ({profile.age} yrs)</span>}
                    </p>
                  </div>
                )}
                {profile?.gender && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gender</p>
                    <p className="text-sm capitalize">{profile.gender}</p>
                  </div>
                )}
                {profile?.bloodGroup && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Blood Group</p>
                    <p className="text-sm font-semibold text-red-600">{profile.bloodGroup}</p>
                  </div>
                )}
                {profile?.category && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</p>
                    <p className="text-sm uppercase font-medium">{profile.category}</p>
                  </div>
                )}
                
                {/* Family Information */}
                {profile?.fatherName && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Father's Name</p>
                    <p className="text-sm capitalize">{profile.fatherName}</p>
                  </div>
                )}
                {profile?.motherName && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Mother's Name</p>
                    <p className="text-sm capitalize">{profile.motherName}</p>
                  </div>
                )}
                
                {/* Other Details */}
                {profile?.nationality && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nationality</p>
                    <p className="text-sm capitalize">{profile.nationality}</p>
                  </div>
                )}
                {profile?.religion && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Religion</p>
                    <p className="text-sm capitalize">{profile.religion}</p>
                  </div>
                )}
              </div>

              {/* Address Section */}
              {profile?.address && (profile.address.city || profile.address.state) && (
                <div className="pt-4 border-t">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Address</p>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>
                      {[profile.address.locality, profile.address.city, profile.address.district, profile.address.state]
                        .filter(Boolean)
                        .join(', ')}
                      {profile.address.pincode && ` - ${profile.address.pincode}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Social Accounts */}
              {record?.socialAccount && record.socialAccount.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Social Links</p>
                  <div className="flex flex-wrap gap-2">
                    {record.socialAccount.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 border rounded-full hover:bg-muted transition-colors"
                      >
                        {social.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          {record?.skills && record.skills.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Skills ({record.skills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {record.skills.map((skill) => (
                    <div key={skill.v_id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold capitalize">{skill.name}</h4>
                        <Badge>Verified</Badge>
                      </div>
                      {skill.topic && skill.topic.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {skill.topic.map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="capitalize">
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

          {/* Certifications */}
          {record?.certificate && record.certificate.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications ({record.certificate.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {record.certificate.map((cert) => (
                    <div key={cert.v_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold capitalize">{cert.name}</h4>
                        {cert.c_id && (
                          <p className="text-sm text-muted-foreground">ID: {cert.c_id}</p>
                        )}
                      </div>
                      <Badge>Verified</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          {record?.project && record.project.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Projects ({record.project.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {record.project.map((project) => (
                    <div key={project.v_id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold capitalize">{project.name}</h4>
                          {project.description && (
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                          )}
                        </div>
                        <Badge>Verified</Badge>
                      </div>
                      {project.technology && project.technology.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technology.map((tech, idx) => (
                            <Badge key={idx} variant="outline" className="capitalize">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Internships */}
          {record?.internship && record.internship.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Internships ({record.internship.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {record.internship.map((intern) => (
                    <div key={intern.v_id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold capitalize">{intern.company}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {intern.field} • {intern.duration} {intern.duration === 1 ? 'month' : 'months'}
                        </p>
                      </div>
                      <Badge>Verified</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Academic Results */}
          {record?.result && record.result.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Results ({record.result.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {record.result.map((result) => (
                    <div key={result.v_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold capitalize">{result.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Score: <span className="font-medium">{result.score}</span> • Roll No: {result.r_no}
                        </p>
                      </div>
                      <Badge>Verified</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {(!record?.skills || record.skills.length === 0) &&
           (!record?.certificate || record.certificate.length === 0) &&
           (!record?.project || record.project.length === 0) &&
           (!record?.internship || record.internship.length === 0) &&
           (!record?.result || record.result.length === 0) && (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your portfolio by uploading your achievements!
                </p>
                <Link to="/student/upload">
                  <Button>Upload Activity</Button>
                </Link>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
