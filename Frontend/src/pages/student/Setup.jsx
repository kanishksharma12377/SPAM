import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import { studentAPI } from '../lib/backend-api';
import { Navigation } from '../../components/Navigation';

// Indian States, Districts, and Cities data
const locationData = {
  "Uttar Pradesh": {
    "Lucknow": ["Lucknow", "Gomti Nagar", "Hazratganj", "Alambagh", "Aliganj"],
    "Kanpur": ["Kanpur", "Kalyanpur", "Kakadeo", "Swaroop Nagar"],
    "Noida": ["Noida", "Greater Noida", "Noida Extension"],
    "Ghaziabad": ["Ghaziabad", "Vaishali", "Indirapuram", "Raj Nagar"],
    "Agra": ["Agra", "Sikandra", "Dayal Bagh"],
    "Meerut": ["Meerut", "Meerut Cantt", "Modipuram"],
    "Varanasi": ["Varanasi", "Banaras", "Ramnagar"],
    "Allahabad": ["Prayagraj", "Allahabad", "Naini"],
    "Bareilly": ["Bareilly", "Izatnagar"],
    "Aligarh": ["Aligarh", "Aligarh Muslim University"]
  },
  "Maharashtra": {
    "Mumbai": ["Mumbai", "Andheri", "Bandra", "Borivali", "Thane", "Navi Mumbai"],
    "Pune": ["Pune", "Pimpri-Chinchwad", "Hinjewadi", "Wakad"],
    "Nagpur": ["Nagpur", "Kamptee"],
    "Nashik": ["Nashik", "Deolali"],
    "Aurangabad": ["Aurangabad", "Waluj"],
    "Solapur": ["Solapur", "Pandharpur"],
    "Kolhapur": ["Kolhapur", "Ichalkaranji"]
  },
  "Delhi": {
    "Central Delhi": ["Connaught Place", "Karol Bagh", "Paharganj"],
    "New Delhi": ["New Delhi", "Chanakyapuri", "Defence Colony"],
    "North Delhi": ["Rohini", "Pitampura", "Model Town"],
    "South Delhi": ["Saket", "Hauz Khas", "Greater Kailash"],
    "East Delhi": ["Preet Vihar", "Mayur Vihar", "Laxmi Nagar"],
    "West Delhi": ["Janakpuri", "Rajouri Garden", "Dwarka"]
  },
  "Karnataka": {
    "Bangalore": ["Bangalore", "Whitefield", "Electronic City", "Koramangala", "Indiranagar"],
    "Mysore": ["Mysore", "Mandya"],
    "Mangalore": ["Mangalore", "Udupi"],
    "Hubli": ["Hubli", "Dharwad"],
    "Belgaum": ["Belgaum", "Belagavi"]
  },
  "Tamil Nadu": {
    "Chennai": ["Chennai", "Anna Nagar", "T Nagar", "Velachery"],
    "Coimbatore": ["Coimbatore", "Gandhipuram", "RS Puram"],
    "Madurai": ["Madurai", "Anna Nagar"],
    "Tiruchirappalli": ["Trichy", "Srirangam"],
    "Salem": ["Salem", "Steel Plant"]
  },
  "West Bengal": {
    "Kolkata": ["Kolkata", "Salt Lake", "Howrah", "Dum Dum"],
    "Darjeeling": ["Darjeeling", "Siliguri"],
    "Howrah": ["Howrah", "Shibpur"],
    "Durgapur": ["Durgapur", "Asansol"],
    "Siliguri": ["Siliguri", "Matigara"]
  },
  "Rajasthan": {
    "Jaipur": ["Jaipur", "Malviya Nagar", "Vaishali Nagar"],
    "Jodhpur": ["Jodhpur", "Sardarpura"],
    "Udaipur": ["Udaipur", "Hiran Magri"],
    "Kota": ["Kota", "Dadabari"],
    "Ajmer": ["Ajmer", "Pushkar"]
  },
  "Gujarat": {
    "Ahmedabad": ["Ahmedabad", "Gandhinagar", "Maninagar"],
    "Surat": ["Surat", "Adajan", "Varachha"],
    "Vadodara": ["Vadodara", "Alkapuri"],
    "Rajkot": ["Rajkot", "Gondal"],
    "Bhavnagar": ["Bhavnagar", "Talaja"]
  },
  "Haryana": {
    "Gurugram": ["Gurugram", "Gurgaon", "DLF City", "Sohna"],
    "Faridabad": ["Faridabad", "Ballabhgarh"],
    "Panipat": ["Panipat", "Samalkha"],
    "Ambala": ["Ambala", "Ambala Cantt"],
    "Hisar": ["Hisar", "Hansi"]
  },
  "Telangana": {
    "Hyderabad": ["Hyderabad", "Secunderabad", "Kukatpally", "Madhapur"],
    "Warangal": ["Warangal", "Hanamkonda"],
    "Nizamabad": ["Nizamabad", "Armoor"],
    "Khammam": ["Khammam", "Kothagudem"]
  },
  "Punjab": {
    "Ludhiana": ["Ludhiana", "Model Town"],
    "Amritsar": ["Amritsar", "Golden Temple Area"],
    "Jalandhar": ["Jalandhar", "Phagwara"],
    "Patiala": ["Patiala", "Rajpura"],
    "Mohali": ["Mohali", "SAS Nagar"]
  },
  "Madhya Pradesh": {
    "Indore": ["Indore", "Vijay Nagar", "Rau"],
    "Bhopal": ["Bhopal", "Kolar", "Berasia"],
    "Jabalpur": ["Jabalpur", "Gorakhpur"],
    "Gwalior": ["Gwalior", "Lashkar"],
    "Ujjain": ["Ujjain", "Mahakal"]
  },
  "Bihar": {
    "Patna": ["Patna", "Boring Road", "Kankarbagh"],
    "Gaya": ["Gaya", "Bodh Gaya"],
    "Bhagalpur": ["Bhagalpur", "Sultanganj"],
    "Muzaffarpur": ["Muzaffarpur", "Sitamarhi"],
    "Darbhanga": ["Darbhanga", "Laheriasarai"]
  }
};

export default function StudentSetup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: {
      firstName: '',
      middleName: '',
      lastName: ''
    },
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    category: '',
    gmail: '',
    contact: '',
    address: {
      locality: '',
      city: '',
      district: '',
      state: '',
      pincode: ''
    },
    class: '',
    branch: '',
    profile: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login?type=student');
      return;
    }
    const user = JSON.parse(userData);
    setStudentInfo(user);
    
    // If user setup is complete, load existing data for editing
    if (user.setup) {
      loadExistingData();
    }
  }, [navigate]);
  
  const loadExistingData = async () => {
    try {
      setIsLoading(true);
      const response = await studentAPI.getRecord();
      
      if (response.success && response.record) {
        const record = response.record;
        setIsEditMode(true);
        
        // Format date for input field
        const formattedDate = record.dob ? new Date(record.dob).toISOString().split('T')[0] : '';
        
        // Set image preview if exists
        if (record.image) {
          setImagePreview(record.image);
        }
        
        setFormData({
          name: {
            firstName: record.name?.firstName || '',
            middleName: record.name?.middleName || '',
            lastName: record.name?.lastName || ''
          },
          fatherName: record.fatherName || '',
          motherName: record.motherName || '',
          dob: formattedDate,
          gender: record.gender || '',
          category: record.category || '',
          gmail: record.gmail || '',
          contact: record.contact || '',
          address: {
            locality: record.address?.locality || '',
            city: record.address?.city || '',
            district: record.address?.district || '',
            state: record.address?.state || '',
            pincode: record.address?.pincode || ''
          },
          class: record.class || '',
          branch: record.branch || '',
          profile: record.profile || ''
        });
        
        // Set available districts and cities based on saved data
        if (record.address?.state) {
          setAvailableDistricts(Object.keys(locationData[record.address.state] || {}));
          if (record.address?.district) {
            setAvailableCities(locationData[record.address.state]?.[record.address.district] || []);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      // If error loading data, continue with empty form
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let dataToSubmit = formData;
      
      // If image is selected, create FormData
      if (selectedImage) {
        const submitFormData = new FormData();
        
        // Add all form fields - only include non-empty optional fields
        submitFormData.append('name', JSON.stringify(formData.name));
        submitFormData.append('fatherName', formData.fatherName);
        submitFormData.append('motherName', formData.motherName);
        submitFormData.append('dob', formData.dob);
        submitFormData.append('gender', formData.gender);
        submitFormData.append('category', formData.category);
        submitFormData.append('gmail', formData.gmail);
        submitFormData.append('contact', formData.contact);
        submitFormData.append('address', JSON.stringify(formData.address));
        submitFormData.append('class', formData.class);
        submitFormData.append('branch', formData.branch);
        // Only add profile if it's not empty and meets minimum length
        if (formData.profile && formData.profile.trim().length >= 3) {
          submitFormData.append('profile', formData.profile);
        }
        submitFormData.append('image', selectedImage);
        
        dataToSubmit = submitFormData;
      } else {
        // For regular JSON submission, filter out empty optional fields
        dataToSubmit = {
          ...formData,
          profile: formData.profile && formData.profile.trim().length >= 3 ? formData.profile : undefined,
          fatherName: formData.fatherName || undefined,
          motherName: formData.motherName || undefined,
        };
        // Remove undefined fields
        Object.keys(dataToSubmit).forEach(key => {
          if (dataToSubmit[key] === undefined || (typeof dataToSubmit[key] === 'string' && dataToSubmit[key].trim() === '')) {
            delete dataToSubmit[key];
          }
        });
      }
      
      // Use update endpoint if in edit mode, setup endpoint otherwise
      if (isEditMode) {
        await studentAPI.updateRecord(dataToSubmit);
        toast.success('Profile updated successfully!');
      } else {
        await studentAPI.setupRecord(dataToSubmit);
        toast.success('Profile setup completed successfully!');
        
        // Update userData in localStorage for new setup
        const userData = JSON.parse(localStorage.getItem('userData'));
        userData.setup = true;
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      
      // Navigate back to profile or dashboard
      setTimeout(() => {
        navigate(isEditMode ? '/student/profile' : '/student/dashboard');
      }, 500);
      
    } catch (error) {
      console.error('Setup/Update error:', error);
      
      // If profile already exists, update the local storage and redirect
      if (error.message && error.message.includes('already exists')) {
        toast.info('Profile already exists. Redirecting to dashboard...');
        
        // Update local storage setup flag
        const userData = JSON.parse(localStorage.getItem('userData'));
        userData.setup = true;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 1500);
      } else {
        toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'setup'} profile`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Handle file input
    if (type === 'file') {
      if (files && files[0]) {
        const file = files[0];
        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
          toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
          return;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }
        setSelectedImage(file);
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
      return;
    }
    
    if (name.startsWith('name.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        name: { ...formData.name, [field]: value }
      });
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      
      // Handle cascading dropdowns
      if (field === 'state') {
        // Reset district and city when state changes
        setAvailableDistricts(Object.keys(locationData[value] || {}));
        setAvailableCities([]);
        setFormData({
          ...formData,
          address: { ...formData.address, state: value, district: '', city: '' }
        });
      } else if (field === 'district') {
        // Reset city when district changes
        setAvailableCities(locationData[formData.address.state]?.[value] || []);
        setFormData({
          ...formData,
          address: { ...formData.address, district: value, city: '' }
        });
      } else {
        setFormData({
          ...formData,
          address: { ...formData.address, [field]: value }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <>
      <Navigation />
      {isLoading && !isEditMode ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      ) : (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl border-2">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-primary">
              {isEditMode ? 'Edit Your Profile' : 'Complete Your Profile'}
            </CardTitle>
            <CardDescription className="text-base">
              Hi {studentInfo?.name}! {isEditMode ? 'Update your profile information below' : 'Please fill in your details to get started with SPAM'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="name.firstName"
                      placeholder="John"
                      value={formData.name.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="name.middleName"
                      placeholder="Optional"
                      value={formData.name.middleName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="name.lastName"
                      placeholder="Doe"
                      value={formData.name.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name *</Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      placeholder="Father's full name"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name *</Label>
                    <Input
                      id="motherName"
                      name="motherName"
                      placeholder="Mother's full name"
                      value={formData.motherName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      name="gender"
                      className="w-full rounded-md border p-2"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      className="w-full rounded-md border p-2"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      <option value="gen">General</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gmail">Gmail *</Label>
                    <Input
                      id="gmail"
                      name="gmail"
                      type="email"
                      placeholder="your.email@gmail.com"
                      value={formData.gmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input
                      id="contact"
                      name="contact"
                      type="tel"
                      placeholder="10-digit mobile"
                      value={formData.contact}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Address Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locality">Locality/Street *</Label>
                    <Input
                      id="locality"
                      name="address.locality"
                      placeholder="Street name, area"
                      value={formData.address.locality}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <select
                      id="city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!formData.address.district}
                    >
                      <option value="">Select City</option>
                      {availableCities.sort().map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <select
                      id="district"
                      name="address.district"
                      value={formData.address.district}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!formData.address.state}
                    >
                      <option value="">Select District</option>
                      {availableDistricts.sort().map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <select
                      id="state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select State</option>
                      {Object.keys(locationData).sort().map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="address.pincode"
                      placeholder="6-digit pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      pattern="[0-9]{6}"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Profile Picture</h3>
                <div className="space-y-4">
                  <div className="flex gap-6">
                    {/* Image Preview */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-32 h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-gray-400 text-sm p-4">
                            <div className="text-3xl mb-2">📷</div>
                            <p>No image selected</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Preview</p>
                    </div>
                    
                    {/* Upload Area */}
                    <div className="flex-1">
                      <Label htmlFor="image" className="block mb-3">Upload Profile Picture *</Label>
                      <div className="mt-2">
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Supported formats: JPEG, PNG, GIF, WEBP<br/>
                          Maximum file size: 5MB<br/>
                          Recommended size: 400x500 pixels
                        </p>
                      </div>
                      {selectedImage && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-800">
                            ✓ {selectedImage.name} ({(selectedImage.size / 1024).toFixed(2)} KB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Academic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class">Current Year *</Label>
                    <select
                      id="class"
                      name="class"
                      className="w-full rounded-md border p-2"
                      value={formData.class}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Year --</option>
                      <option value="1yr">1st Year</option>
                      <option value="2yr">2nd Year</option>
                      <option value="3yr">3rd Year</option>
                      <option value="4yr">4th Year</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch *</Label>
                    <select
                      id="branch"
                      name="branch"
                      className="w-full rounded-md border p-2"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Branch --</option>
                      <option value="cs">Computer Science</option>
                      <option value="ce">Civil Engineering</option>
                      <option value="me">Mechanical Engineering</option>
                      <option value="ee">Electrical Engineering</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile">Profile/Bio (Optional)</Label>
                  <Textarea
                    id="profile"
                    name="profile"
                    placeholder="Tell us about yourself, your interests, skills, and goals (optional)"
                    value={formData.profile}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-lg py-6"
                    onClick={() => navigate('/student/profile')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className={`text-lg py-6 ${isEditMode ? 'flex-1' : 'w-full'}`} 
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (isEditMode ? 'Updating...' : 'Setting up...') 
                    : (isEditMode ? 'Save Changes' : 'Complete Setup & Start Using SPAM')
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      )}
    </>
  );
}
