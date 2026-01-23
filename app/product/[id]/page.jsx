"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, Settings, Download, X } from 'lucide-react';
import ProductInquiry from '../../productInquiry/page.jsx';
import WhyChooseSection from '../../components/WhyChooseSection.jsx';
import { useParams, useRouter } from "next/navigation";
import { useWishlistStore } from '@/store/wishlistStore';

const ProductDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const videoRef = useRef(null);
    const videoContainerRef = useRef(null);

    // Wishlist store (global, shared with other pages)
    const { wishlist, toggleWishlist, isInWishlist, initialize } = useWishlistStore();

    // Fallback images
    const fallbackImages = [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
    ];

    // Initialize wishlist on client
    useEffect(() => {
        if (typeof window !== 'undefined') {
            initialize();
        }
    }, [initialize]);

    const getCookie = (name) => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    /* ================= FIXED: FETCH PRODUCT ================= */
    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                console.log('🆔 Fetching product with ID:', id);
                
                const res = await fetch(`/api/admin/products/${id}`);
                const data = await res.json();

                if (!data.success || !data.data) {
                    console.log('❌ Product not found, using fallback');
                    useFallbackProduct();
                    return;
                }

                console.log('✅ Product fetched successfully:', data.data);
                setProduct(data.data);
                
            } catch (err) {
                console.error('❌ Fetch error:', err);
                useFallbackProduct();
            } finally {
                setLoading(false);
            }
        };

        // Fallback function
        const useFallbackProduct = () => {
            const fallbackProduct = {
                _id: id || "1",
                name: "Premium Marble Ganesha Statue",
                price: 2999,
                moq: 50,
                thumbnail: fallbackImages[0],
                images: fallbackImages,
                video360: "", // No video in fallback for simplicity
                category: { 
                    _id: "cat1", 
                    name: "Statues" 
                },
                subCategory: { 
                    _id: "sub1", 
                    name: "Ganesha" 
                },
                finish: "Hand Painted",
                productType: "Ready Stock",
                services: ["Custom Design", "Private Label"],
                features: [
                    "Hand carved from premium marble",
                    "Eco-friendly materials",
                    "Expert craftsmanship",
                    "Perfect for home and office decor",
                    "Makes an excellent gift"
                ],
                godName: "Ganesha",
                color: "White & Gold",
                suitableFor: "Home & Office",
                usage: "Interior Decor, Gift, Worship",
                posture: "Sitting",
                baseShape: "Round",
                appearance: "Glossy",
                careInstruction: "Wipe with dry cloth, Keep away from water",
                assemblyRequired: "Already Assembled",
                availability: "In Stock",
                shortDescription: "Beautiful marble Ganesha statue for spiritual and decorative purposes",
                longDescription: "This exquisite marble statue of Lord Ganesha is meticulously hand-carved by skilled artisans. Made from premium quality marble, it features intricate detailing and a beautiful finish. Perfect for home decor, office spaces, or as a spiritual centerpiece. The statue brings positive energy and prosperity to any space.",
                description: "Premium quality marble statue of Lord Ganesha for home and office decor"
            };
            setProduct(fallbackProduct);
        };

        fetchProduct();
    }, [id, router]);

    /* ================= FIXED: EXTRACT MEDIA (VIDEO FIRST) ================= */
    const extractMedia = () => {
        if (!product) return { mediaItems: [], videoUrl: null };
        
        let mediaItems = [];
        const thumbnail = product.thumbnail || fallbackImages[0];

        // ✅ VIDEO FIRST in the media list
        if (product.video360) {
            mediaItems.push({
                type: 'video',
                url: product.video360,
                thumbnail: thumbnail,
                title: '360° Product View'
            });
        }
        
        // Add thumbnail as first image
        if (thumbnail) {
            mediaItems.push({
                type: 'image',
                url: thumbnail,
                isThumbnail: true
            });
        }
        
        // Add other images
        if (product.images && Array.isArray(product.images)) {
            product.images.forEach((image, index) => {
                if (image && image !== thumbnail) {
                    mediaItems.push({
                        type: 'image',
                        url: image,
                        index: index
                    });
                }
            });
        }
        
        // Ensure at least one item
        if (mediaItems.length === 0) {
            mediaItems.push({ type: 'image', url: fallbackImages[0] });
        }
        
        return {
            mediaItems,
            videoUrl: product.video360,
            thumbnail
        };
    };

    const { mediaItems, videoUrl, thumbnail } = extractMedia();
    const currentMedia = mediaItems[currentMediaIndex];

    // Auto-play video when it's the first/current media (muted for browser policies)
    useEffect(() => {
        if (!videoRef.current) return;

        if (currentMedia && currentMedia.type === 'video') {
            videoRef.current.muted = true;
            setIsMuted(true);
            const playPromise = videoRef.current.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch((err) => {
                        console.warn('Autoplay blocked or failed:', err);
                        setIsPlaying(false);
                    });
            } else {
                setIsPlaying(true);
            }
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentMedia, currentMediaIndex]);

    /* ================= VIDEO CONTROL FUNCTIONS ================= */
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(err => {
                    console.error('Video play error:', err);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
            if (!videoRef.current.muted) {
                videoRef.current.volume = volume;
            }
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
            setIsMuted(newVolume === 0);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration || 0);
        }
    };

    const handleProgressClick = (e) => {
        if (videoRef.current && duration > 0) {
            const progressBar = e.currentTarget;
            const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
            const progressBarWidth = progressBar.clientWidth;
            const percentage = clickPosition / progressBarWidth;
            const newTime = percentage * duration;
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time) || time === 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoContainerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const nextSlide = () => {
        if (mediaItems.length) {
            setCurrentMediaIndex((prev) => {
                const nextIndex = (prev + 1) % mediaItems.length;
                if (mediaItems[prev]?.type === 'video' && videoRef.current) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
                return nextIndex;
            });
        }
    };
    
    const prevSlide = () => {
        if (mediaItems.length) {
            setCurrentMediaIndex((prev) => {
                const prevIndex = prev === 0 ? mediaItems.length - 1 : prev - 1;
                if (mediaItems[prev]?.type === 'video' && videoRef.current) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
                return prevIndex;
            });
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
        // Auto-play next media if video ends
        setTimeout(() => {
            nextSlide();
        }, 1000);
    };

    const handleVideoLoaded = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.volume = volume;
        }
    };

    /* ================= FIXED: TRANSFORM PRODUCT DATA ================= */
    const transformProductData = () => {
        if (!product) return null;

        return {
            id: product._id || "1",
            name: product.name || "Premium Product",
            price: product.price || 2999,
            moq: product.moq || product.minimumOrderQuantity || 50,
            images: mediaItems.filter(item => item.type === 'image').map(item => item.url),
            video360: videoUrl,
            godName: product.godName || "",
            color: product.color || "",
            suitableFor: product.suitableFor || "",
            usage: product.usage || "",
            posture: product.posture || "",
            baseShape: product.baseShape || "",
            finish: product.finish || "",
            appearance: product.appearance || "",
            careInstruction: product.careInstruction || "",
            assemblyRequired: product.assemblyRequired || "",
            availability: product.availability || "In Stock",
            shortDescription: product.shortDescription || "",
            longDescription: product.longDescription || product.description || `Enhance your space with our beautiful ${product.name}.`,
            features: product.features || ["Premium Quality", "Handmade", "Eco-friendly"],
            services: product.services || [],
            category: product.category?.name || "Statues",
            subCategory: product.subCategory?.name || "Ganesha"
        };
    };

    const transformedProduct = transformProductData();
    const isWishlisted = transformedProduct ? isInWishlist(transformedProduct.id) : false;

    /* ================= FIXED: PRODUCT SPECS ================= */
    const productSpecs = [
        { label: "Product Name", value: transformedProduct?.name || "N/A" },
        { label: "Category", value: transformedProduct?.category || "N/A" },
        { label: "Sub Category", value: transformedProduct?.subCategory || "N/A" },
        { label: "God Name", value: transformedProduct?.godName || "N/A" },
        { label: "Color", value: transformedProduct?.color || "N/A" },
        { label: "Suitable For", value: transformedProduct?.suitableFor || "N/A" },
        { label: "Usage/Application", value: transformedProduct?.usage || "N/A" },
        { label: "Posture", value: transformedProduct?.posture || "N/A" },
        { label: "Base Shape", value: transformedProduct?.baseShape || "N/A" },
        { label: "Finish", value: transformedProduct?.finish || "N/A" },
        { label: "Appearance", value: transformedProduct?.appearance || "N/A" },
        { label: "Care Instruction", value: transformedProduct?.careInstruction || "N/A" },
        { label: "Assembly Required", value: transformedProduct?.assemblyRequired || "N/A" },
        { label: "Availability", value: transformedProduct?.availability || "N/A" },
    ];

    if (loading) {
        return (
            <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf8e44] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product || !transformedProduct) {
        return (
            <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Product not found</p>
                    <button 
                        onClick={() => router.push("/category")}
                        className="mt-4 px-6 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#a56e2e] transition-colors"
                    >
                        Back to Categories
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#fffcf7] min-h-screen font-sans pb-8 md:pb-20">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 md:pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
                    {/* LEFT COLUMN - Media Gallery */}
                    <div className="lg:col-span-7 space-y-4 md:space-y-6">
                        {/* Main Media Display */}
                        <div 
                            ref={videoContainerRef}
                            className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
                        >
                            {currentMedia?.type === 'video' ? (
                                <div className="relative w-full h-full group">
                                    <video
                                        ref={videoRef}
                                        src={currentMedia.url}
                                        className="w-full h-full object-contain bg-black"
                                        onEnded={handleVideoEnded}
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedData={handleVideoLoaded}
                                        playsInline
                                        preload="metadata"
                                        poster={currentMedia.thumbnail}
                                        muted={isMuted}
                                        autoPlay={currentMedia?.type === 'video'}
                                        controls={false}
                                    />
                                    
                                    {/* Video Controls Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {/* Progress Bar */}
                                        <div 
                                            className="w-full h-1 md:h-1.5 bg-gray-600 rounded-full mb-3 md:mb-4 cursor-pointer"
                                            onClick={handleProgressClick}
                                        >
                                            <div 
                                                className="h-full bg-[#C08237] rounded-full"
                                                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                                            />
                                        </div>
                                        
                                        {/* Control Buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 md:gap-4">
                                                {/* Play/Pause */}
                                                <button
                                                    onClick={togglePlayPause}
                                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                                    aria-label={isPlaying ? "Pause" : "Play"}
                                                >
                                                    {isPlaying ? (
                                                        <Pause size={18} className="text-white md:w-5 md:h-5" />
                                                    ) : (
                                                        <Play size={18} className="text-white md:w-5 md:h-5" />
                                                    )}
                                                </button>
                                                
                                                {/* Time Display */}
                                                <span className="text-white text-xs md:text-sm font-medium">
                                                    {formatTime(currentTime)} / {formatTime(duration)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 md:gap-4">
                                                {/* Volume Control */}
                                                <div className="relative" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                                                    <button
                                                        onClick={toggleMute}
                                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                                        aria-label={isMuted ? "Unmute" : "Mute"}
                                                    >
                                                        {isMuted || volume === 0 ? (
                                                            <VolumeX size={18} className="text-white md:w-5 md:h-5" />
                                                        ) : (
                                                            <Volume2 size={18} className="text-white md:w-5 md-h-5" />
                                                        )}
                                                    </button>
                                                    
                                                    {showVolumeSlider && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 backdrop-blur-sm rounded-lg z-10">
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="1"
                                                                step="0.1"
                                                                value={volume}
                                                                onChange={handleVolumeChange}
                                                                className="w-24 h-1.5 bg-gray-600 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C08237] [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C08237]"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Fullscreen */}
                                                <button
                                                    onClick={toggleFullscreen}
                                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                                    aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                                                >
                                                    <Maximize2 size={18} className="text-white md:w-5 md:h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Video Badge */}
                                    <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#C08237] text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <Play size={10} className="md:w-3 md:h-3" /> 360° VIEW
                                    </div>
                                    
                                    {/* Play Button Overlay when paused */}
                                    {!isPlaying && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <button
                                                onClick={togglePlayPause}
                                                className="w-16 h-16 md:w-20 md:h-20 bg-[#C08237]/90 rounded-full flex items-center justify-center hover:bg-[#C08237] transition-colors"
                                            >
                                                <Play size={32} className="text-white ml-1" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <img 
                                            src={currentMedia?.url} 
                                            className="w-full h-full object-contain p-4"
                                            alt={transformedProduct.name}
                                            onError={(e) => {
                                                console.log('Image failed to load:', currentMedia?.url);
                                                if (thumbnail && thumbnail !== currentMedia?.url) {
                                                    e.target.src = thumbnail;
                                                } else if (fallbackImages[0]) {
                                                    e.target.src = fallbackImages[0];
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-gray-800 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                                        IMAGE
                                    </div>
                                </>
                            )}
                            
                            {/* Navigation Arrows */}
                            {mediaItems.length > 1 && (
                                <>
                                    <button 
                                        onClick={prevSlide} 
                                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                        aria-label="Previous"
                                    >
                                        <ChevronLeft size={18} className="text-gray-700 md:w-6 md:h-6" />
                                    </button>
                                    <button 
                                        onClick={nextSlide} 
                                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                        aria-label="Next"
                                    >
                                        <ChevronRight size={18} className="text-gray-700 md:w-6 md:h-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails Grid - Responsive */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2 md:gap-3">
                            {mediaItems.map((media, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (media.type === 'video' && videoRef.current) {
                                            videoRef.current.pause();
                                            setIsPlaying(false);
                                        }
                                        setCurrentMediaIndex(idx);
                                    }}
                                    className={`relative aspect-square rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${currentMediaIndex === idx ? 'border-[#C08237] scale-[1.02] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                                    aria-label={`View ${media.type} ${idx + 1}`}
                                >
                                    {media.type === 'video' ? (
                                        <>
                                            <img 
                                                src={media.thumbnail || thumbnail}
                                                alt="Video thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <Play size={14} className="text-white md:w-4 md:h-4" />
                                            </div>
                                            <div className="absolute top-1 right-1 bg-[#C08237] text-white text-[9px] md:text-[10px] px-1 py-0.5 rounded">
                                                VIDEO
                                            </div>
                                        </>
                                    ) : (
                                        <img 
                                            src={media.url} 
                                            alt={`${transformedProduct.name} thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = fallbackImages[idx % fallbackImages.length];
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Product Details */}
                    <div className="lg:col-span-5 space-y-4 md:space-y-6">
                        {/* Product Header */}
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                        {transformedProduct.name}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs md:text-sm text-gray-500">Category:</span>
                                        <span className="text-xs md:text-sm font-medium text-[#C08237]">
                                            {transformedProduct.category}
                                            {transformedProduct.subCategory && ` › ${transformedProduct.subCategory}`}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (transformedProduct) {
                                            toggleWishlist(transformedProduct.id);
                                        }
                                    }}
                                    className="p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    {/* Same wishlist heart UI as listing cards */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-5 w-6 transition-colors duration-200 ${
                                            isWishlisted 
                                                ? "fill-red-500 text-red-500" 
                                                : "text-gray-800 fill-transparent hover:text-red-400"
                                        }`}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={isWishlisted ? 0 : 2}
                                    >
                                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Price and MOQ Card */}
                            <div className="bg-[#F9F5F0] rounded-xl p-4 md:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <p className="text-xs md:text-sm text-gray-600">Price per piece</p>
                                        <p className="text-2xl md:text-3xl font-bold text-gray-900">₹ {transformedProduct.price}</p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-xs md:text-sm text-gray-600">Minimum Order Quantity</p>
                                        <p className="text-xl md:text-2xl font-bold text-[#C08237]">{transformedProduct.moq} Pieces</p>
                                    </div>
                                </div>
                                
                                {/* Quantity Selector */}
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Quantity:</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button 
                                                onClick={() => setQuantity(prev => Math.max(transformedProduct.moq, prev - 1))}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center font-medium">
                                                {quantity}
                                            </span>
                                            <button 
                                                onClick={() => setQuantity(prev => prev + 1)}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Total: <span className="font-bold text-[#C08237]">₹ {transformedProduct.price * quantity}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Minimum quantity: {transformedProduct.moq} pieces
                                    </p>
                                </div>
                                
                                {/* FIXED: Inquiry Button */}
                                <button
                                    onClick={() => {
                                        // Login check: based on isLoggedIn cookie (set on login)
                                        const isLoggedIn =
                                            typeof window !== 'undefined'
                                                ? getCookie('isLoggedIn') === 'true'
                                                : false;
                                        if (!isLoggedIn) {
                                            router.push('/login');
                                            return;
                                        }

                                        // Direct navigate to inquiry page (no modal)
                                        const productId = transformedProduct?.id;
                                        const qty = quantity || transformedProduct?.moq || 1;
                                        router.push(`/productInquiry?productId=${productId}&quantity=${qty}`);
                                    }}
                                    className="w-full py-3 bg-[#C08237] text-white font-semibold rounded-lg hover:bg-[#a56e2e] transition-colors text-sm md:text-base flex items-center justify-center gap-2"
                                >
                                    <span>Send Product Inquiry</span>
                                    <ChevronRight size={18} className="md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Specs Card */}
                        <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Specifications</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {productSpecs.slice(0, 8).map((spec, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <p className="text-xs md:text-sm text-gray-500">{spec.label}</p>
                                        <p className="text-sm md:text-base font-medium text-gray-800 truncate">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => {
                                    document.getElementById('full-specs')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full mt-4 py-2 md:py-3 text-[#C08237] font-medium border border-[#C08237] rounded-lg hover:bg-[#C08237] hover:text-white transition-colors text-sm md:text-base"
                            >
                                View All Specifications
                            </button>
                        </div>

                        {/* Product Description Card */}
                        <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
                                {transformedProduct.shortDescription || transformedProduct.longDescription}
                            </p>
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-800 text-sm md:text-base">Key Features:</h4>
                                <ul className="space-y-2">
                                    {transformedProduct.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-[#C08237] rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
                                            <span className="text-sm text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Services Card */}
                        {transformedProduct.services && transformedProduct.services.length > 0 && (
                            <div className="bg-gradient-to-r from-[#F9F5F0] to-[#FFF4E6] rounded-xl p-4 md:p-5 border border-[#E8D9C3]">
                                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Our Services</h3>
                                <div className="space-y-3">
                                    {transformedProduct.services.map((service, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="w-6 h-6 md:w-7 md:h-7 bg-[#C08237] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-white font-bold text-xs md:text-sm">✓</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm md:text-base">{service}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Video Info Card - Only show if video exists */}
                        {videoUrl && (
                            <div className="bg-blue-50 rounded-xl p-4 md:p-5 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-[#C08237] rounded-full flex items-center justify-center">
                                        <Play size={16} className="text-white" />
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800">360° View Available</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Experience this product in 360° view. Rotate, zoom and explore every angle before making a decision.
                                </p>
                                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                                    <Settings size={14} className="md:w-4 md:h-4" />
                                    <span>Use mouse/touch to rotate • Scroll to zoom • Click play to start</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Full Specifications Section */}
                <div id="full-specs" className="mt-8 md:mt-12 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">Complete Product Specifications</h3>
                        <button className="text-xs md:text-sm text-[#C08237] font-medium hover:text-[#a56e2e] transition-colors">
                            Print Specifications
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {productSpecs.map((spec, idx) => (
                            <div key={idx} className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <p className="text-xs md:text-sm text-gray-500 font-medium mb-1">{spec.label}</p>
                                <p className="text-sm md:text-base font-semibold text-gray-800">{spec.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* FIXED: Product Inquiry Modal */}
            {showInquiryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Product Inquiry</h3>
                            <button 
                                onClick={() => setShowInquiryModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Product:</p>
                                <p className="font-medium">{transformedProduct.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Quantity:</p>
                                <p className="font-medium">{quantity} pieces</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Amount:</p>
                                <p className="text-xl font-bold text-[#C08237]">₹ {transformedProduct.price * quantity}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowInquiryModal(false);
                                    router.push(`/productInquiry?productId=${transformedProduct.id}&quantity=${quantity}`);
                                }}
                                className="w-full py-3 bg-[#C08237] text-white font-semibold rounded-lg hover:bg-[#a56e2e] transition-colors"
                            >
                                Proceed to Inquiry Form
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className='my-6 md:my-8 px-3 sm:px-4 md:px-0'>
                <ProductInquiry/>
            </div>

            <div className='my-6 md:my-8 px-3 sm:px-4 md:px-0'>
                <WhyChooseSection/>
            </div>
        </div>
    );
};

export default ProductDetailPage;