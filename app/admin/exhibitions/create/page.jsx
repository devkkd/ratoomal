"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Upload, X, Plus, Calendar, User, Tag, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CreateEditExhibitionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    longDescription: '',
    startDate: '',
    endDate: '',
    openingHours: '10:00 AM - 6:00 PM',
    location: '',
    address: '',
    mainImage: '',
    galleryImages: [],
    category: 'Art',
    featured: false,
    curator: {
      name: '',
      bio: '',
      image: ''
    },
    artists: [{ name: '', role: 'Artist' }],
    ticketPrice: 'Free',
    duration: '',
    expectedVisitors: '',
    highlights: [''],
    about: '',
    tags: [''],
    status: 'draft'
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Art', 'Sculpture', 'Handicrafts', 'Antiques', 
    'Cultural', 'Religious', 'Contemporary'
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  // Fetch exhibition data for editing
  useEffect(() => {
    if (isEditing && editId) {
      fetchExhibitionData();
    }
  }, [isEditing, editId]);

  const fetchExhibitionData = async () => {
    try {
      setFetchingData(true);
      const response = await fetch(`/api/admin/exhibitions/${editId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exhibition data');
      }

      const data = await response.json();
      if (data.success) {
        const exhibition = data.data;
        setFormData({
          ...exhibition,
          startDate: exhibition.startDate ? new Date(exhibition.startDate).toISOString().split('T')[0] : '',
          endDate: exhibition.endDate ? new Date(exhibition.endDate).toISOString().split('T')[0] : '',
          curator: exhibition.curator || { name: '', bio: '', image: '' },
          artists: exhibition.artists?.length > 0 ? exhibition.artists : [{ name: '', role: 'Artist' }],
          highlights: exhibition.highlights?.length > 0 ? exhibition.highlights : [''],
          tags: exhibition.tags?.length > 0 ? exhibition.tags : [''],
          galleryImages: exhibition.galleryImages || []
        });
      }
    } catch (error) {
      console.error('Error fetching exhibition:', error);
      alert('Failed to load exhibition data');
    } finally {
      setFetchingData(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle array field changes
  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Add array item
  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  // Remove array item
  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handle artist changes
  const handleArtistChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      artists: prev.artists.map((artist, i) => 
        i === index ? { ...artist, [field]: value } : artist
      )
    }));
  };

  // Upload image to Cloudinary via API
  const uploadImage = async (file, folder = 'exhibitions') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Handle main image upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadImage(file, 'exhibitions/main');
      setFormData(prev => ({ ...prev, mainImage: imageUrl }));
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle gallery images upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingGallery(true);
      const uploadPromises = files.map(file => uploadImage(file, 'exhibitions/gallery'));
      const imageUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...imageUrls]
      }));
    } catch (error) {
      alert('Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  // Handle curator image upload
  const handleCuratorImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file, 'exhibitions/curators');
      setFormData(prev => ({
        ...prev,
        curator: { ...prev.curator, image: imageUrl }
      }));
    } catch (error) {
      alert('Failed to upload curator image');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.mainImage) newErrors.mainImage = 'Main image is required';

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Clean up data
      const submitData = {
        ...formData,
        highlights: formData.highlights.filter(h => h.trim()),
        tags: formData.tags.filter(t => t.trim()),
        artists: formData.artists.filter(a => a.name.trim())
      };

      const url = isEditing 
        ? `/api/admin/exhibitions/${editId}`
        : '/api/admin/exhibitions';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        alert(isEditing ? 'Exhibition updated successfully!' : 'Exhibition created successfully!');
        router.push('/admin/exhibitions');
      } else {
        alert(data.error || 'Failed to save exhibition');
      }
    } catch (error) {
      console.error('Error saving exhibition:', error);
      alert('Failed to save exhibition');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C08237]"></div>
          <p className="ml-3 text-gray-600">Loading exhibition data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/exhibitions"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 playfair">
            {isEditing ? 'Edit Exhibition' : 'Create Exhibition'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update exhibition details' : 'Add a new art exhibition or event'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter exhibition title"
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    placeholder="Enter exhibition tagline"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter short description"
                  />
                  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Long Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    placeholder="Enter detailed description"
                  />
                </div>

                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About the Exhibition
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    placeholder="Additional information about the exhibition"
                  />
                </div>
              </div>
            </div>

            {/* Date & Location */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date & Location
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent ${
                      errors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent ${
                      errors.endDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
                </div>

                {/* Opening Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    placeholder="e.g., 10:00 AM - 6:00 PM"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    placeholder="e.g., 2 hours"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter location name"
                  />
                  {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter full address"
                  />
                  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>
              
              {/* Main Image */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {formData.mainImage ? (
                    <div className="relative">
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                          src={formData.mainImage}
                          alt="Main exhibition image"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mainImage: '' }))}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            {uploadingImage ? 'Uploading...' : 'Upload main image'}
                          </span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleMainImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                {errors.mainImage && <p className="text-red-600 text-sm mt-1">{errors.mainImage}</p>}
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.galleryImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <label className="cursor-pointer">
                      <span className="text-sm font-medium text-gray-900">
                        {uploadingGallery ? 'Uploading...' : 'Add gallery images'}
                      </span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        disabled={uploadingGallery}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Curator Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Curator Information
              </h2>
              
              <div className="space-y-6">
                {/* Curator Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curator Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.curator.image && (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={formData.curator.image}
                          alt="Curator"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                      <span className="text-sm font-medium">Upload Photo</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleCuratorImageUpload}
                      />
                    </label>
                    {formData.curator.image && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          curator: { ...prev.curator, image: '' }
                        }))}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Curator Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curator Name
                  </label>
                  <input
                    type="text"
                    name="curator.name"
                    value={formData.curator.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    placeholder="Enter curator name"
                  />
                </div>

                {/* Curator Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curator Bio
                  </label>
                  <textarea
                    name="curator.bio"
                    value={formData.curator.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    placeholder="Enter curator biography"
                  />
                </div>
              </div>
            </div>

            {/* Artists */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Artists</h2>
              
              <div className="space-y-4">
                {formData.artists.map((artist, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Artist Name
                      </label>
                      <input
                        type="text"
                        value={artist.name}
                        onChange={(e) => handleArtistChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                        placeholder="Enter artist name"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={artist.role}
                        onChange={(e) => handleArtistChange(index, 'role', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                        placeholder="Role"
                      />
                    </div>
                    {formData.artists.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('artists', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('artists', { name: '', role: 'Artist' })}
                  className="flex items-center gap-2 text-[#C08237] hover:text-[#A06B2A] font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Artist
                </button>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Highlights</h2>
              
              <div className="space-y-3">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                      placeholder="Enter highlight"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('highlights', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('highlights', '')}
                  className="flex items-center gap-2 text-[#C08237] hover:text-[#A06B2A] font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Highlight
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h2>
              
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                      placeholder="Enter tag"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tags', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('tags', '')}
                  className="flex items-center gap-2 text-[#C08237] hover:text-[#A06B2A] font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#C08237] focus:ring-[#C08237] border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Featured Exhibition
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              
              <div className="space-y-4">
                {/* Ticket Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Price
                  </label>
                  <input
                    type="text"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    placeholder="e.g., Free, $10, ₹500"
                  />
                </div>

                {/* Expected Visitors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Visitors
                  </label>
                  <input
                    type="text"
                    name="expectedVisitors"
                    value={formData.expectedVisitors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    placeholder="e.g., 500-1000"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C08237] text-white py-3 px-4 rounded-lg hover:bg-[#A06B2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : (isEditing ? 'Update Exhibition' : 'Create Exhibition')}
                </button>
                
                <Link
                  href="/admin/exhibitions"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEditExhibitionPage;