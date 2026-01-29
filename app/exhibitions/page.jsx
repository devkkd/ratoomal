"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Star, Filter, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useReliableTranslation } from '@/hooks/useReliableTranslation';
import NotificationToast, { useNotification } from '../components/NotificationToast';

const ExhibitionsPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [filteredExhibitions, setFilteredExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { notification, showNotification, hideNotification } = useNotification();
  const { currentLanguage } = useReliableTranslation();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Art', label: 'Art' },
    { value: 'Sculpture', label: 'Sculpture' },
    { value: 'Handicrafts', label: 'Handicrafts' },
    { value: 'Antiques', label: 'Antiques' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Religious', label: 'Religious' },
    { value: 'Contemporary', label: 'Contemporary' }
  ];

  const filters = [
    { value: 'all', label: 'All Exhibitions' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'current', label: 'Current' },
    { value: 'featured', label: 'Featured' }
  ];

  // Fetch exhibitions
  const fetchExhibitions = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        status: 'published'
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (selectedFilter === 'upcoming') {
        params.append('upcoming', 'true');
      } else if (selectedFilter === 'featured') {
        params.append('featured', 'true');
      }

      const response = await fetch(`/api/exhibitions?${params}`);
      const data = await response.json();

      if (data.success) {
        setExhibitions(data.data);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.currentPage);
      } else {
        showNotification('Failed to fetch exhibitions', 'error');
      }
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      showNotification('Error loading exhibitions', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter exhibitions based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredExhibitions(exhibitions);
      return;
    }

    const filtered = exhibitions.filter(exhibition =>
      exhibition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibition.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibition.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredExhibitions(filtered);
  }, [exhibitions, searchQuery]);

  // Fetch exhibitions on filter change
  useEffect(() => {
    fetchExhibitions(1);
  }, [selectedCategory, selectedFilter]);

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

  return (
    <div className="min-h-screen bg-[#FFF6EB]">
      <NotificationToast 
        notification={notification}
        onClose={hideNotification}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#C08237] to-[#A66D2E] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold playfair mb-4">
              Art Exhibitions
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover extraordinary art and cultural exhibitions
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search exhibitions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg  ring-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
              >
                {filters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-gray-600">
              {filteredExhibitions.length} exhibition{filteredExhibitions.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      {/* Exhibitions Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredExhibitions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No exhibitions found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExhibitions.map((exhibition) => {
              const status = getExhibitionStatus(exhibition);
              const daysRemaining = getDaysRemaining(exhibition.endDate);

              return (
                <Link 
                  key={exhibition._id} 
                  href={`/exhibitions/${exhibition._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={exhibition.mainImage || '/images/placeholder.png'}
                        alt={exhibition.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {exhibition.featured && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            Featured
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#C08237] transition-colors playfair">
                        {exhibition.title}
                      </h3>
                      
                      {exhibition.tagline && (
                        <p className="text-[#C08237] font-medium mb-3">
                          {exhibition.tagline}
                        </p>
                      )}

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {exhibition.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{exhibition.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{exhibition.openingHours}</span>
                        </div>

                        {status.status === 'current' && daysRemaining > 0 && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Users className="w-4 h-4" />
                            <span>{daysRemaining} days remaining</span>
                          </div>
                        )}
                      </div>

                      {/* View More */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[#C08237] font-medium">
                            {exhibition.ticketPrice}
                          </span>
                          <div className="flex items-center gap-1 text-[#C08237] group-hover:gap-2 transition-all">
                            <span className="font-medium">View Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchExhibitions(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => fetchExhibitions(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-[#C08237] text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => fetchExhibitions(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExhibitionsPage;