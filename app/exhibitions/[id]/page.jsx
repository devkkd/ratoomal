"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, MapPin, Clock, Users, Star, ArrowLeft, Share2, 
  User, Tag, Info, Image as ImageIcon, ChevronLeft, ChevronRight 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NotificationToast, { useNotification } from '../../components/NotificationToast';

const ExhibitionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  
  const { notification, showNotification, hideNotification } = useNotification();

  // Fetch exhibition details
  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/exhibitions/${params.id}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        if (data.success) {
          setExhibition(data.data);
        } else {
          showNotification('Exhibition not found', 'error');
          router.push('/exhibitions');
        }
      } catch (error) {
        console.error('Error fetching exhibition:', error);
        showNotification('Error loading exhibition', 'error');
        router.push('/exhibitions');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchExhibition();
    }
  }, [params.id]); // Removed router and showNotification from dependencies

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get exhibition status
  const getExhibitionStatus = (exhibition) => {
    const now = new Date();
    const startDate = new Date(exhibition.startDate);
    const endDate = new Date(exhibition.endDate);

    if (startDate > now) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (startDate <= now && endDate >= now) {
      return { status: 'current', label: 'Current', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'past', label: 'Past', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Get days remaining
  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Share exhibition
  const shareExhibition = async () => {
    const url = window.location.href;
    const title = exhibition.title;
    const text = exhibition.description;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        showNotification('Link copied to clipboard!', 'success');
      } catch (error) {
        showNotification('Failed to copy link', 'error');
      }
    }
  };

  // Image navigation
  const nextImage = () => {
    if (exhibition.galleryImages && exhibition.galleryImages.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === exhibition.galleryImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (exhibition.galleryImages && exhibition.galleryImages.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? exhibition.galleryImages.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF6EB] animate-pulse">
        <div className="h-96 bg-gray-200"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!exhibition) {
    return null;
  }

  const status = getExhibitionStatus(exhibition);
  const daysRemaining = getDaysRemaining(exhibition.endDate);
  const allImages = [exhibition.mainImage, ...(exhibition.galleryImages || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FFF6EB]">
      <NotificationToast 
        notification={notification}
        onClose={hideNotification}
      />

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={exhibition.mainImage || '/images/placeholder.png'}
          alt={exhibition.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => router.back()}
            className="bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Share Button */}
        <div className="absolute top-6 right-6">
          <button
            onClick={shareExhibition}
            className="bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
              {exhibition.featured && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Featured
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 playfair">
              {exhibition.title}
            </h1>
            {exhibition.tagline && (
              <p className="text-xl md:text-2xl text-white/90 mb-4">
                {exhibition.tagline}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 playfair">About This Exhibition</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {exhibition.description}
              </p>
              
              {exhibition.longDescription && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {exhibition.longDescription}
                  </p>
                </div>
              )}

              {exhibition.about && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {exhibition.about}
                  </p>
                </div>
              )}
            </div>

            {/* Highlights */}
            {exhibition.highlights && exhibition.highlights.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 playfair">Exhibition Highlights</h2>
                <ul className="space-y-3">
                  {exhibition.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C08237] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Artists */}
            {exhibition.artists && exhibition.artists.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 playfair">Featured Artists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exhibition.artists.map((artist, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <User className="w-8 h-8 text-[#C08237]" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{artist.name}</h3>
                        <p className="text-sm text-gray-600">{artist.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curator */}
            {exhibition.curator && exhibition.curator.name && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 playfair">Curator</h2>
                <div className="flex items-start gap-6">
                  {exhibition.curator.image ? (
                    <Image
                      src={exhibition.curator.image}
                      alt={exhibition.curator.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{exhibition.curator.name}</h3>
                    {exhibition.curator.bio && (
                      <p className="text-gray-700 leading-relaxed">{exhibition.curator.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Gallery */}
            {exhibition.galleryImages && exhibition.galleryImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 playfair">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {exhibition.galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => {
                        setCurrentImageIndex(index + 1); // +1 because main image is at index 0
                        setShowImageModal(true);
                      }}
                    >
                      <Image
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 playfair">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#C08237] mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Duration</p>
                    <p className="text-gray-600">
                      {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                    </p>
                    {exhibition.duration && (
                      <p className="text-sm text-gray-500">{exhibition.duration}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C08237] mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Opening Hours</p>
                    <p className="text-gray-600">{exhibition.openingHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C08237] mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{exhibition.location}</p>
                    <p className="text-sm text-gray-500">{exhibition.address}</p>
                  </div>
                </div>

                {exhibition.ticketPrice && (
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-[#C08237] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Ticket Price</p>
                      <p className="text-gray-600">{exhibition.ticketPrice}</p>
                    </div>
                  </div>
                )}

                {exhibition.expectedVisitors && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#C08237] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Expected Visitors</p>
                      <p className="text-gray-600">{exhibition.expectedVisitors}</p>
                    </div>
                  </div>
                )}

                {status.status === 'current' && daysRemaining > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <Info className="w-5 h-5" />
                      <span className="font-medium">
                        {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category & Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 playfair">Category</h3>
              <span className="inline-block bg-[#FFF8F0] text-[#C08237] px-4 py-2 rounded-full text-sm font-medium">
                {exhibition.category}
              </span>

              {exhibition.tags && exhibition.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {exhibition.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Back to Exhibitions */}
            <Link
              href="/exhibitions"
              className="block w-full bg-[#C08237] text-white text-center py-3 px-6 rounded-full hover:bg-[#A66D2E] transition-colors font-medium"
            >
              View All Exhibitions
            </Link>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && allImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="relative">
              <Image
                src={allImages[currentImageIndex]}
                alt={`Exhibition image ${currentImageIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            <div className="text-center text-white mt-4">
              {currentImageIndex + 1} of {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitionDetailPage;