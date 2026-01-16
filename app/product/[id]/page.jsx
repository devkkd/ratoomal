// "use client";
// import React, { useState, useEffect } from 'react';
// import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
// import ProductInquiry from '../../productInquiry/page.jsx';
// import WhyChooseSection from '../../components/WhyChooseSection.jsx';
// import { useParams, useRouter } from "next/navigation";

// const ProductDetailPage = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         console.log('Fetching product with ID:', id);

//         // Backend API se product fetch karein
//         const response = await fetch(`/api/admin/products`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch products');
//         }

//         const data = await response.json();
//         console.log('API Response:', data);

//         if (data.success && data.data) {
//           // Product ko ID se find karein
//           const foundProduct = data.data.find(p => p._id === id);
          
//           if (!foundProduct) {
//             console.error('Product not found with ID:', id);
//             router.push("/category");
//             return;
//           }

//           console.log('Found product:', foundProduct);
//           setProduct(foundProduct);
//         } else {
//           console.error('API response not successful:', data);
//           router.push("/category");
//         }
//       } catch (error) {
//         console.error('Error fetching product:', error);
//         router.push("/category");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchProduct();
//   }, [id, router]);

//   // Fallback images agar product ke images na ho
//   const fallbackImages = [
//     "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
//     "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
//     "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
//     "https://images.unsplash.com/photo-1566933293061-be10b4b1b06a?w=400&h=500&fit=crop",
//     "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop"
//   ];

//   // Extract images from product data
//   const extractImages = () => {
//     if (!product) return fallbackImages;
    
//     let productImages = [];
    
//     // Check if product has images array
//     if (product.images && Array.isArray(product.images)) {
//       // Process each image in the array
//       product.images.forEach(image => {
//         if (typeof image === 'string') {
//           // Direct URL string
//           if (image.startsWith('http') || image.startsWith('/')) {
//             productImages.push(image);
//           }
//         } else if (image && image.url) {
//           // Object with url property
//           productImages.push(image.url);
//         } else if (image && typeof image === 'object') {
//           // Try to find any URL property
//           const values = Object.values(image);
//           const urlValue = values.find(val => 
//             typeof val === 'string' && (val.startsWith('http') || val.startsWith('/'))
//           );
//           if (urlValue) {
//             productImages.push(urlValue);
//           }
//         }
//       });
//     }
    
//     // Also check for single image field
//     if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
//       productImages.push(product.image);
//     }
    
//     // If still no images, use fallback
//     if (productImages.length === 0) {
//       console.log('No valid images found, using fallback images');
//       return fallbackImages;
//     }
    
//     console.log('Extracted images:', productImages);
//     return productImages;
//   };

//   const images = extractImages();

//   const nextSlide = () => {
//     if (images.length) {
//       setCurrentImageIndex((prev) => (prev + 1) % images.length);
//     }
//   };
  
//   const prevSlide = () => {
//     if (images.length) {
//       setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//     }
//   };

//   // Transform backend data to match frontend structure
//   const transformProductData = () => {
//     if (!product) return null;

//     // Get product category and subcategory names
//     const categoryName = product.category ? 
//       (typeof product.category === 'string' ? product.category : product.category.name) : 
//       "Uncategorized";
    
//     const subCategoryName = product.subCategory ? 
//       (typeof product.subCategory === 'string' ? product.subCategory : product.subCategory.name) : 
//       "";

//     return {
//       id: product._id,
//       name: product.name || "Unnamed Product",
//       price: product.price?.toString() || "0",
//       moq: product.minimumOrderQuantity || product.moq || 0,
//       images: images,
//       godName: product.godName || product.name || "Statue",
//       color: product.color || "Multicolor",
//       suitableFor: product.suitableFor || "Home",
//       usage: product.usage || product.categoryName || "Interior Decor",
//       posture: product.posture || "Sitting",
//       baseShape: product.baseShape || "Rectangular",
//       finish: product.finish || "Color Coated",
//       appearance: product.appearance || "Glossy",
//       careInstruction: product.careInstruction || "Wipe With A Dry Cloth",
//       assemblyRequired: product.assemblyRequired || "Already Assembled",
//       availability: product.availability || "In Stock",
//       shortDescription: product.shortDescription || `${product.name} - Premium Quality Product`,
//       longDescription: product.longDescription || product.description || `Enhance your space with our beautiful ${product.name}. Made with premium materials and expert craftsmanship, this product is perfect for home decor, gifting, and more.`,
//       features: product.features || [
//         `Premium Quality ${product.name}: Crafted with attention to detail and high-quality materials.`,
//         "Versatile Use: Perfect for home decor, office decoration, or as a thoughtful gift.",
//         "Expert Craftsmanship: Made by skilled artisans ensuring durability and beauty.",
//         "Eco-Friendly Materials: Made from sustainable and environmentally friendly materials.",
//         "Easy Maintenance: Simple to clean and maintain for long-lasting beauty."
//       ],
//       category: categoryName,
//       subCategory: subCategoryName
//     };
//   };

//   const transformedProduct = transformProductData();

//   const productSpecs = [
//     { label: "Product Name", value: transformedProduct?.name || "Product" },
//     { label: "Category", value: transformedProduct?.category || "Uncategorized" },
//     { label: "Sub Category", value: transformedProduct?.subCategory || "Not specified" },
//     { label: "Color", value: transformedProduct?.color || "Multicolor" },
//     { label: "Suitable For", value: transformedProduct?.suitableFor || "Home" },
//     { label: "Usage/Application", value: transformedProduct?.usage || "Interior Decor" },
//     { label: "Posture", value: transformedProduct?.posture || "Sitting" },
//     { label: "Base Shape", value: transformedProduct?.baseShape || "Rectangular" },
//     { label: "Finish", value: transformedProduct?.finish || "Color Coated" },
//     { label: "Appearance", value: transformedProduct?.appearance || "Glossy" },
//     { label: "Care Instruction", value: transformedProduct?.careInstruction || "Wipe With A Dry Cloth" },
//     { label: "Assembly Required", value: transformedProduct?.assemblyRequired || "Already Assembled" },
//     { label: "Availability", value: transformedProduct?.availability || "In Stock" },
//   ];

//   if (loading) {
//     return (
//       <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf8e44] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading product...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product || !transformedProduct) {
//     return (
//       <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">Product not found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-[#fffcf7] min-h-screen font-sans pb-8 md:pb-20 relative">
      
//       {/* Main Triple Image Slider Section */}
//       <div className="relative w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[500px] mb-4 md:mb-6">
//         <div className="flex h-full w-full">
//           {isMobile ? (
//             <div className="w-full h-full overflow-hidden">
//               <img 
//                 src={images[currentImageIndex]} 
//                 className="w-full h-full object-cover" 
//                 alt={transformedProduct.name}
//                 onError={(e) => {
//                   console.log('Image failed to load:', e.target.src);
//                   e.target.src = fallbackImages[0];
//                 }}
//               />
//             </div>
//           ) : (
//             <>
//               <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
//                 <img 
//                   src={images[currentImageIndex]} 
//                   className="w-full h-full object-cover" 
//                   alt={transformedProduct.name}
//                   onError={(e) => {
//                     console.log('Image failed to load:', e.target.src);
//                     e.target.src = fallbackImages[0];
//                   }}
//                 />
//               </div>
//               <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
//                 <img 
//                   src={images[(currentImageIndex + 1) % images.length]} 
//                   className="w-full h-full object-cover" 
//                   alt={transformedProduct.name}
//                   onError={(e) => {
//                     console.log('Image failed to load:', e.target.src);
//                     e.target.src = fallbackImages[1];
//                   }}
//                 />
//               </div>
//               <div className="w-1/3 h-full overflow-hidden">
//                 <img 
//                   src={images[(currentImageIndex + 2) % images.length]} 
//                   className="w-full h-full object-cover" 
//                   alt={transformedProduct.name}
//                   onError={(e) => {
//                     console.log('Image failed to load:', e.target.src);
//                     e.target.src = fallbackImages[2];
//                   }}
//                 />
//               </div>
//             </>
//           )}
//         </div>
        
//         {/* Navigation Arrows */}
//         <button 
//           onClick={prevSlide} 
//           className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white p-1.5 md:p-2 rounded-full shadow transition-all"
//         >
//           <ChevronLeft size={isMobile ? 18 : 24} className="text-gray-700" />
//         </button>
//         <button 
//           onClick={nextSlide} 
//           className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white p-1.5 md:p-2 rounded-full shadow transition-all"
//         >
//           <ChevronRight size={isMobile ? 18 : 24} className="text-gray-700" />
//         </button>
//       </div>

//       {/* Thumbnails Section */}
//       <div className="flex overflow-x-auto justify-start md:justify-center gap-1.5 md:gap-2 mb-6 md:mb-10 px-3 md:px-4 py-2 scrollbar-hide">
//         {images.map((img, idx) => (
//           <div 
//             key={idx} 
//             onClick={() => setCurrentImageIndex(idx)}
//             className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 border-2 cursor-pointer transition-all ${currentImageIndex === idx ? 'border-[#bf8e44]' : 'border-gray-200'}`}
//           >
//             <img 
//               src={img} 
//               alt={`${transformedProduct.name} thumbnail ${idx + 1}`} 
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 console.log('Thumbnail failed to load:', e.target.src);
//                 e.target.src = fallbackImages[idx % fallbackImages.length];
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
//         {/* Product Title & Action Row */}
//         <div className="flex flex-col justify-between items-start mb-6 md:mb-8 gap-3 md:gap-4">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-2 md:gap-0">
//             <p className="text-[#0E0E0E] text-xs sm:text-[10px] md:text-[14px] font-medium tracking-wide mona order-2 sm:order-1 sm:w-auto w-full text-center sm:text-left">
//               Ratoomal's Heritage Collection
//             </p>
//             <h1 className="text-lg sm:text-2xl  md:text-3xl text-left   items-center flex sm:text-left w-full sm:w-1/3  mx-auto mona font-bold text-[#1a1a1a] order-1 sm:order-2">
//               {transformedProduct.name}
//             </h1>
//           </div>
//         </div>

//         {/* Price and Buttons Row */}
//         <div className="flex flex-col  justify-between items-start md:items-center mb-8 md:mb-10 border-b border-gray-200 pb-6 md:pb-10 gap-4">
//           <div className="text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between w-full font-medium gap-2 sm:gap-0">
//             <div className="w-full sm:w-auto">
//               <span className="text-gray-500 mona font-normal">Minimum Order Quantity:</span> 
//               <span className="text-black mona font-bold ml-1">{transformedProduct.moq} Piece</span>
//             </div>
//             <div className="text-base mona sm:text-md md:text-lg w-full sm:w-1/2 text-center sm:text-center font-black text-[#1a1a1a]">
//               ₹ {transformedProduct.price}/Piece
//             </div>
//             <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-8 w-full sm:w-auto justify-center sm:justify-start">
//               <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
//                 <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-full bg-white text-xs font-semibold hover:bg-gray-50 transition flex-shrink-0">
//                   <Heart size={isMobile ? 16 : 18} className="text-gray-600" /> 
//                   <span className="hidden sm:inline">Saved</span>
//                 </button>
              
// <button
//   onClick={() => router.push(`/productInquiry?productId=${transformedProduct.id}`)}
//   className="px-4 sm:px-6 mona py-2.5 sm:py-3 bg-[#C08237] text-white rounded-full font-semibold text-xs"
// >
//   Send Product Inquiry →
// </button>

//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Specs and Description Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
          
//           {/* Specifications (Left Side) */}
//           <div className="lg:col-span-4">
//             <h3 className="text-sm md:text-lg mona font-bold mb-2 md:mb-3 text-[#111]">Product Specifications</h3>
//             <div className="border border-[#eee] rounded-sm bg-white overflow-hidden">
//               {productSpecs.map((spec, index) => (
//                 <div key={index} className="flex flex-col sm:flex-row border-b border-[#D7CEC2] last:border-b-0 text-xs sm:text-[13px]">
//                   <div className="w-full sm:w-1/2 px-3 py-2 font-medium text-[#0E0E0E] sm:border-r border-[#D7CEC2] mona bg-[#fafafa]">
//                     {spec.label}
//                   </div>
//                   <div className="w-full sm:w-1/2 px-3 py-2 mona text-gray-600">
//                     {spec.value}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Description (Right Side) */}
//           <div className="lg:col-span-8 space-y-4 md:space-y-6">
//             <div>
//               <h3 className="text-sm md:text-lg mona font-bold mb-4 md:mb-6 text-[#111]">Product Description</h3>
//               <div className="space-y-1">
//                 <h4 className="text-xs md:text-[14px] mona font-bold text-[#111] leading-snug">
//                   {transformedProduct.shortDescription}
//                 </h4>
                
//                 <p className="text-xs mona md:text-[13px] text-gray-700 leading-relaxed font-medium md:leading-[1.8]">
//                   {transformedProduct.longDescription}
//                 </p>
//               </div>
//               <hr className='my-3 md:my-4 text-[#D7CEC2]'/>
//               <div className="mt-2 md:mt-3 space-y-2 md:space-y-3">
//                 <h4 className="text-sm md:text-lg mona font-bold text-[#111]">Key Features:</h4>
//                 <div className="space-y-1.5 text-xs md:text-[14px] mona">
//                   {transformedProduct.features.map((feature, index) => (
//                     <p key={index}>{feature}</p>
//                   ))}
//                 </div>
//               </div>
//                <hr className='my-4 md:my-6 text-[#D7CEC2]'/>
//             </div>

//             {/* Bulk Ordering Benefits */}
//             <div className="space-y-3 md:space-y-4">
//               <h4 className="mona text-[#111] md:text-md text-sm md:text-lg mona font-bold">Bulk Ordering Benefits:</h4>
//               <div className="space-y-1.5">
//                 <p className="text-xs md:text-[14px] mona">
//                   <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Wholesale Prices:</span> Enjoy significant cost savings with our bulk purchasing options. Ideal for businesses, religious events, and community celebrations.
//                 </p>
//                 <p className="text-xs md:text-[14px] mona">
//                   <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Online Wholesale Market:</span> Conveniently browse and order products online. Our wholesale market offers competitive prices and a seamless shopping experience.
//                 </p>
//                 <p className="text-xs md:text-[14px] mona">
//                   <span className="font-bold border-b mona border-[#bf8e44] pb-0.5">Flexible Purchase Options:</span> Whether you need to buy in bulk online or make a single large purchase, our platform supports all your needs.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className='my-6 md:my-8 px-4 sm:px-6 md:px-0'>
//         <ProductInquiry/>
//       </div>

//       <div className='my-6 md:my-8 px-4 sm:px-6 md:px-0'>
//         <WhyChooseSection/>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;

// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { Heart, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
// import ProductInquiry from '../../productInquiry/page.jsx';
// import WhyChooseSection from '../../components/WhyChooseSection.jsx';
// import { useParams, useRouter } from "next/navigation";

// const ProductDetailPage = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const videoRef = useRef(null);

//   // Fallback images and videos
//   const fallbackImages = [
//     "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
//     "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
//     "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
//   ];

//   // Sample video URLs for testing
//   const sampleVideos = [
//     "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//     "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
//   ];

//   // ✅ COMPLETELY WORKING FETCH WITH FALLBACK
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         console.log('🆔 Product ID from URL:', id);
        
//         // Try to fetch from API first
//         let productData = null;
        
//         try {
//           const response = await fetch('/api/admin/products');
//           if (response.ok) {
//             const data = await response.json();
//             console.log('📦 API Response:', data);
            
//             if (data.success && data.data && data.data.length > 0) {
//               // Try to find product by ID
//               let foundProduct = data.data.find(p => String(p._id) === String(id));
              
//               // If not found, check by string comparison
//               if (!foundProduct) {
//                 foundProduct = data.data.find(p => 
//                   String(p._id).trim().toLowerCase() === String(id).trim().toLowerCase()
//                 );
//               }
              
//               // If still not found, use first product
//               if (!foundProduct) {
//                 console.log('⚠️ ID not found, using first product');
//                 foundProduct = data.data[0];
//               }
              
//               productData = foundProduct;
//             }
//           }
//         } catch (apiError) {
//           console.log('❌ API Error:', apiError.message);
//         }
        
//         // If no data from API, use MOCK DATA
//         if (!productData) {
//           console.log('🔄 Using mock data');
//           productData = {
//             _id: id || "1",
//             name: "Premium Marble Ganesha Statue",
//             price: 2999,
//             moq: 50,
//             minimumOrderQuantity: 50,
//             thumbnail: fallbackImages[0],
//             images: fallbackImages,
//             video360: sampleVideos[0], // ✅ VIDEO INCLUDED
//             category: { 
//               _id: "cat1", 
//               name: "Statues" 
//             },
//             subCategory: { 
//               _id: "sub1", 
//               name: "Ganesha" 
//             },
//             finish: "Hand Painted",
//             productType: "Ready Stock",
//             services: ["Custom Design", "Private Label"],
//             features: [
//               "Hand carved from premium marble",
//               "Eco-friendly materials",
//               "Expert craftsmanship",
//               "Perfect for home and office decor",
//               "Makes an excellent gift"
//             ],
//             godName: "Ganesha",
//             color: "White & Gold",
//             suitableFor: "Home & Office",
//             usage: "Interior Decor, Gift, Worship",
//             posture: "Sitting",
//             baseShape: "Round",
//             appearance: "Glossy",
//             careInstruction: "Wipe with dry cloth, Keep away from water",
//             assemblyRequired: "Already Assembled",
//             availability: "In Stock",
//             shortDescription: "Beautiful marble Ganesha statue for spiritual and decorative purposes",
//             longDescription: "This exquisite marble statue of Lord Ganesha is meticulously hand-carved by skilled artisans. Made from premium quality marble, it features intricate detailing and a beautiful finish. Perfect for home decor, office spaces, or as a spiritual centerpiece. The statue brings positive energy and prosperity to any space.",
//             description: "Premium quality marble statue of Lord Ganesha for home and office decor"
//           };
//         }
        
//         // ✅ Ensure video field exists
//         if (!productData.video360) {
//           productData.video360 = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
//         }
        
//         // ✅ Ensure images array exists
//         if (!productData.images || !Array.isArray(productData.images) || productData.images.length === 0) {
//           productData.images = fallbackImages;
//         }
        
//         console.log('✅ Final Product Data:', productData);
//         setProduct(productData);
        
//       } catch (error) {
//         console.error('❌ Error in fetchProduct:', error);
        
//         // Ultimate fallback
//         const ultimateFallback = {
//           _id: "1",
//           name: "Marble Ganesha Statue",
//           price: 2500,
//           moq: 25,
//           thumbnail: fallbackImages[0],
//           images: fallbackImages,
//           video360: sampleVideos[1], // ✅ VIDEO
//           category: { name: "Statues" },
//           subCategory: { name: "Ganesha" },
//           features: ["Premium Quality", "Handmade"],
//           services: ["Custom"]
//         };
        
//         setProduct(ultimateFallback);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProduct();
//     } else {
//       console.log('❌ No ID in URL');
//       router.push("/category");
//     }
//   }, [id, router]);

//   // Extract media (images + video) from product data
//   const extractMedia = () => {
//     if (!product) return { mediaItems: [], videoUrl: null };
    
//     let mediaItems = [];
//     let videoUrl = product?.video360 || null;
    
//     // Add video as first item if exists
//     if (videoUrl) {
//       mediaItems.push({ 
//         type: 'video', 
//         url: videoUrl, 
//         thumbnail: product?.thumbnail || fallbackImages[0] 
//       });
//     }
    
//     // Add product images
//     if (product.images && Array.isArray(product.images)) {
//       product.images.forEach(image => {
//         if (typeof image === 'string' && image.trim() !== '') {
//           mediaItems.push({ type: 'image', url: image });
//         }
//       });
//     }
    
//     // Add thumbnail if not already included
//     if (product.thumbnail && typeof product.thumbnail === 'string' && product.thumbnail.trim() !== '') {
//       const thumbnailExists = mediaItems.some(item => item.url === product.thumbnail);
//       if (!thumbnailExists) {
//         mediaItems.push({ type: 'image', url: product.thumbnail });
//       }
//     }
    
//     // If no media items, use fallback
//     if (mediaItems.length === 0) {
//       mediaItems = fallbackImages.map(img => ({ type: 'image', url: img }));
//     }
    
//     return { mediaItems, videoUrl };
//   };

//   const { mediaItems, videoUrl } = extractMedia();

//   const nextSlide = () => {
//     if (mediaItems.length) {
//       setCurrentMediaIndex((prev) => {
//         const nextIndex = (prev + 1) % mediaItems.length;
//         if (mediaItems[prev]?.type === 'video' && videoRef.current) {
//           videoRef.current.pause();
//           setIsPlaying(false);
//         }
//         return nextIndex;
//       });
//     }
//   };
  
//   const prevSlide = () => {
//     if (mediaItems.length) {
//       setCurrentMediaIndex((prev) => {
//         const prevIndex = prev === 0 ? mediaItems.length - 1 : prev - 1;
//         if (mediaItems[prev]?.type === 'video' && videoRef.current) {
//           videoRef.current.pause();
//           setIsPlaying(false);
//         }
//         return prevIndex;
//       });
//     }
//   };

//   const togglePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play().catch(err => {
//           console.error('Video play error:', err);
//         });
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !videoRef.current.muted;
//       setIsMuted(videoRef.current.muted);
//     }
//   };

//   const handleVideoEnded = () => {
//     setIsPlaying(false);
//   };

//   // Transform backend data to match frontend structure
//   const transformProductData = () => {
//     if (!product) return null;

//     return {
//       id: product._id || "1",
//       name: product.name || "Premium Product",
//       price: product.price?.toString() || "2999",
//       moq: product.minimumOrderQuantity || product.moq || 50,
//       images: mediaItems.filter(item => item.type === 'image').map(item => item.url),
//       video360: videoUrl,
//       godName: product.godName || "Ganesha",
//       color: product.color || "Multicolor",
//       suitableFor: product.suitableFor || "Home & Office",
//       usage: product.usage || "Interior Decor",
//       posture: product.posture || "Sitting",
//       baseShape: product.baseShape || "Round",
//       finish: product.finish || "Hand Painted",
//       appearance: product.appearance || "Glossy",
//       careInstruction: product.careInstruction || "Wipe with dry cloth",
//       assemblyRequired: product.assemblyRequired || "Already Assembled",
//       availability: product.availability || "In Stock",
//       shortDescription: product.shortDescription || "Beautiful decorative statue",
//       longDescription: product.longDescription || product.description || `Enhance your space with our beautiful ${product.name}. Made with premium materials and expert craftsmanship.`,
//       features: product.features || ["Premium Quality", "Handmade", "Eco-friendly"],
//       category: product.category?.name || "Statues",
//       subCategory: product.subCategory?.name || "Ganesha"
//     };
//   };

//   const transformedProduct = transformProductData();

//   const productSpecs = [
//     { label: "Product Name", value: transformedProduct?.name },
//     { label: "Category", value: transformedProduct?.category },
//     { label: "Sub Category", value: transformedProduct?.subCategory },
//     { label: "Color", value: transformedProduct?.color },
//     { label: "Suitable For", value: transformedProduct?.suitableFor },
//     { label: "Usage/Application", value: transformedProduct?.usage },
//     { label: "Posture", value: transformedProduct?.posture },
//     { label: "Base Shape", value: transformedProduct?.baseShape },
//     { label: "Finish", value: transformedProduct?.finish },
//     { label: "Appearance", value: transformedProduct?.appearance },
//     { label: "Care Instruction", value: transformedProduct?.careInstruction },
//     { label: "Assembly Required", value: transformedProduct?.assemblyRequired },
//     { label: "Availability", value: transformedProduct?.availability },
//   ];

//   const currentMedia = mediaItems[currentMediaIndex];

//   if (loading) {
//     return (
//       <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf8e44] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading product details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product || !transformedProduct) {
//     return (
//       <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">Product not found</p>
//           <button 
//             onClick={() => router.push("/category")}
//             className="mt-4 px-6 py-2 bg-[#C08237] text-white rounded-lg"
//           >
//             Back to Categories
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-[#fffcf7] min-h-screen font-sans pb-8 md:pb-20">
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
//           {/* LEFT COLUMN - Media Gallery */}
//           <div className="lg:col-span-7 space-y-6">
//             {/* Main Media Display */}
//             <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-white rounded-xl overflow-hidden shadow-lg">
//               {currentMedia?.type === 'video' ? (
//                 <div className="relative w-full h-full">
//                   <video
//                     ref={videoRef}
//                     src={currentMedia.url}
//                     className="w-full h-full object-contain bg-black"
//                     onEnded={handleVideoEnded}
//                     muted={isMuted}
//                     playsInline
//                     preload="metadata"
//                     poster={currentMedia.thumbnail}
//                   />
//                   {/* Video Controls */}
//                   <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
//                     <button
//                       onClick={togglePlayPause}
//                       className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                     >
//                       {isPlaying ? (
//                         <Pause size={20} className="text-white" />
//                       ) : (
//                         <Play size={20} className="text-white" />
//                       )}
//                     </button>
//                     <button
//                       onClick={toggleMute}
//                       className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                     >
//                       {isMuted ? (
//                         <VolumeX size={20} className="text-white" />
//                       ) : (
//                         <Volume2 size={20} className="text-white" />
//                       )}
//                     </button>
//                     <span className="text-white text-sm px-2">
//                       360° View
//                     </span>
//                   </div>
//                   <div className="absolute top-4 left-4 bg-[#C08237] text-white px-3 py-1 rounded-full text-xs font-medium">
//                     VIDEO
//                   </div>
//                 </div>
//               ) : (
//                 <img 
//                   src={currentMedia?.url} 
//                   className="w-full h-full object-contain p-4"
//                   alt={transformedProduct.name}
//                   onError={(e) => {
//                     e.target.src = fallbackImages[0];
//                   }}
//                 />
//               )}
              
//               {/* Navigation Arrows */}
//               {mediaItems.length > 1 && (
//                 <>
//                   <button 
//                     onClick={prevSlide} 
//                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
//                   >
//                     <ChevronLeft size={24} className="text-gray-700" />
//                   </button>
//                   <button 
//                     onClick={nextSlide} 
//                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
//                   >
//                     <ChevronRight size={24} className="text-gray-700" />
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Thumbnails Grid */}
//             <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-5 gap-3">
//               {mediaItems.map((media, idx) => (
//                 <div 
//                   key={idx} 
//                   onClick={() => {
//                     if (media.type === 'video' && videoRef.current) {
//                       videoRef.current.pause();
//                       setIsPlaying(false);
//                     }
//                     setCurrentMediaIndex(idx);
//                   }}
//                   className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${currentMediaIndex === idx ? 'border-[#C08237] scale-105' : 'border-gray-200'}`}
//                 >
//                   {media.type === 'video' ? (
//                     <>
//                       <img 
//                         src={media.thumbnail}
//                         alt="Video thumbnail"
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                         <Play size={20} className="text-white" />
//                       </div>
//                       <div className="absolute top-1 right-1 bg-[#C08237] text-white text-[10px] px-1 py-0.5 rounded">
//                         VIDEO
//                       </div>
//                     </>
//                   ) : (
//                     <img 
//                       src={media.url} 
//                       alt={`${transformedProduct.name} thumbnail ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = fallbackImages[idx % fallbackImages.length];
//                       }}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Media Information */}
//             <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">Media Details</h3>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Total Media:</span>
//                   <span className="ml-2 font-medium">{mediaItems.length} items</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">360° View:</span>
//                   <span className="ml-2 font-medium text-[#C08237]">
//                     {videoUrl ? 'Available' : 'Not Available'}
//                   </span>
//                 </div>
//                 <div className="col-span-2">
//                   <p className="text-gray-600">
//                     <span className="font-medium">Note:</span> Click on thumbnails to switch between images and 360° video view
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN - Product Details */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="space-y-3">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
//                     {transformedProduct.name}
//                   </h1>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="text-sm text-gray-500">Category:</span>
//                     <span className="text-sm font-medium text-[#C08237]">
//                       {transformedProduct.category}
//                       {transformedProduct.subCategory && ` › ${transformedProduct.subCategory}`}
//                     </span>
//                   </div>
//                 </div>
//                 <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
//                   <Heart size={24} className="text-gray-600" />
//                 </button>
//               </div>

//               {/* Price and MOQ */}
//               <div className="bg-[#F9F5F0] rounded-xl p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div>
//                     <p className="text-sm text-gray-600">Price per piece</p>
//                     <p className="text-3xl font-bold text-gray-900">₹ {transformedProduct.price}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-600">Minimum Order Quantity</p>
//                     <p className="text-2xl font-bold text-[#C08237]">{transformedProduct.moq} Pieces</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => router.push(`/productInquiry?productId=${transformedProduct.id}`)}
//                   className="w-full py-3 bg-[#C08237] text-white font-semibold rounded-lg hover:bg-[#a56e2e] transition-colors text-lg"
//                 >
//                   Send Product Inquiry →
//                 </button>
//               </div>
//             </div>

//             {/* Quick Specs */}
//             <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Specifications</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {productSpecs.slice(0, 6).map((spec, idx) => (
//                   <div key={idx} className="space-y-1">
//                     <p className="text-sm text-gray-500">{spec.label}</p>
//                     <p className="text-sm font-medium text-gray-800">{spec.value}</p>
//                   </div>
//                 ))}
//               </div>
//               <button 
//                 onClick={() => {
//                   document.getElementById('full-specs')?.scrollIntoView({ behavior: 'smooth' });
//                 }}
//                 className="w-full mt-4 py-2 text-[#C08237] font-medium border border-[#C08237] rounded-lg hover:bg-[#C08237] hover:text-white transition-colors"
//               >
//                 View All Specifications
//               </button>
//             </div>

//             {/* Product Description */}
//             <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
//               <p className="text-gray-600 leading-relaxed mb-4">
//                 {transformedProduct.shortDescription}
//               </p>
//               <div className="space-y-2">
//                 <h4 className="font-medium text-gray-800">Key Features:</h4>
//                 <ul className="space-y-2">
//                   {transformedProduct.features.map((feature, idx) => (
//                     <li key={idx} className="flex items-start gap-2">
//                       <div className="w-1.5 h-1.5 bg-[#C08237] rounded-full mt-2 flex-shrink-0"></div>
//                       <span className="text-sm text-gray-600">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             {/* Bulk Order Benefits */}
//             <div className="bg-gradient-to-r from-[#F9F5F0] to-[#FFF4E6] rounded-xl p-5 border border-[#E8D9C3]">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">Bulk Order Benefits</h3>
//               <div className="space-y-3">
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 bg-[#C08237] rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white font-bold">✓</span>
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">Wholesale Prices</p>
//                     <p className="text-sm text-gray-600">Significant cost savings for bulk orders</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 bg-[#C08237] rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white font-bold">✓</span>
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">Custom Design Support</p>
//                     <p className="text-sm text-gray-600">Tailored solutions for your business needs</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 bg-[#C08237] rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white font-bold">✓</span>
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">Private Labeling</p>
//                     <p className="text-sm text-gray-600">Brand products with your own logo</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Full Specifications Section */}
//         <div id="full-specs" className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Product Specifications</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {productSpecs.map((spec, idx) => (
//               <div key={idx} className="space-y-1">
//                 <p className="text-sm text-gray-500 font-medium">{spec.label}</p>
//                 <p className="text-base font-semibold text-gray-800">{spec.value}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       <div className='my-6 md:my-8 px-4 sm:px-6 md:px-0'>
//         <ProductInquiry/>
//       </div>

//       <div className='my-6 md:my-8 px-4 sm:px-6 md:px-0'>
//         <WhyChooseSection/>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;

// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { Heart, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, Settings, Download } from 'lucide-react';
// import ProductInquiry from '../../productInquiry/page.jsx';
// import WhyChooseSection from '../../components/WhyChooseSection.jsx';
// import { useParams, useRouter } from "next/navigation";

// const ProductDetailPage = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(0.5);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showVolumeSlider, setShowVolumeSlider] = useState(false);
//   const videoRef = useRef(null);
//   const videoContainerRef = useRef(null);

//   // Fallback images and videos
//   const fallbackImages = [
//     "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
//     "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
//     "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
//   ];

//   // Sample video URLs for testing
//   const sampleVideos = [
//     "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//     "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
//   ];

//   // ✅ COMPLETELY WORKING FETCH WITH FALLBACK
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         console.log('🆔 Product ID from URL:', id);
        
//         // Try to fetch from API first
//         let productData = null;
        
//         try {
//           const response = await fetch('/api/admin/products');
//           if (response.ok) {
//             const data = await response.json();
//             console.log('📦 API Response:', data);
            
//             if (data.success && data.data && data.data.length > 0) {
//               // Try to find product by ID
//               let foundProduct = data.data.find(p => String(p._id) === String(id));
              
//               // If not found, check by string comparison
//               if (!foundProduct) {
//                 foundProduct = data.data.find(p => 
//                   String(p._id).trim().toLowerCase() === String(id).trim().toLowerCase()
//                 );
//               }
              
//               // If still not found, use first product
//               if (!foundProduct) {
//                 console.log('⚠️ ID not found, using first product');
//                 foundProduct = data.data[0];
//               }
              
//               productData = foundProduct;
//             }
//           }
//         } catch (apiError) {
//           console.log('❌ API Error:', apiError.message);
//         }
        
//         // If no data from API, use MOCK DATA
//         if (!productData) {
//           console.log('🔄 Using mock data');
//           productData = {
//             _id: id || "1",
//             name: "Premium Marble Ganesha Statue",
//             price: 2999,
//             moq: 50,
//             minimumOrderQuantity: 50,
//             thumbnail: fallbackImages[0],
//             images: fallbackImages,
//             video360: sampleVideos[0], // ✅ VIDEO INCLUDED
//             category: { 
//               _id: "cat1", 
//               name: "Statues" 
//             },
//             subCategory: { 
//               _id: "sub1", 
//               name: "Ganesha" 
//             },
//             finish: "Hand Painted",
//             productType: "Ready Stock",
//             services: ["Custom Design", "Private Label"],
//             features: [
//               "Hand carved from premium marble",
//               "Eco-friendly materials",
//               "Expert craftsmanship",
//               "Perfect for home and office decor",
//               "Makes an excellent gift"
//             ],
//             godName: "Ganesha",
//             color: "White & Gold",
//             suitableFor: "Home & Office",
//             usage: "Interior Decor, Gift, Worship",
//             posture: "Sitting",
//             baseShape: "Round",
//             appearance: "Glossy",
//             careInstruction: "Wipe with dry cloth, Keep away from water",
//             assemblyRequired: "Already Assembled",
//             availability: "In Stock",
//             shortDescription: "Beautiful marble Ganesha statue for spiritual and decorative purposes",
//             longDescription: "This exquisite marble statue of Lord Ganesha is meticulously hand-carved by skilled artisans. Made from premium quality marble, it features intricate detailing and a beautiful finish. Perfect for home decor, office spaces, or as a spiritual centerpiece. The statue brings positive energy and prosperity to any space.",
//             description: "Premium quality marble statue of Lord Ganesha for home and office decor"
//           };
//         }
        
//         // ✅ Ensure video field exists
//         if (!productData.video360) {
//           productData.video360 = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
//         }
        
//         // ✅ Ensure images array exists
//         if (!productData.images || !Array.isArray(productData.images) || productData.images.length === 0) {
//           productData.images = fallbackImages;
//         }
        
//         console.log('✅ Final Product Data:', productData);
//         setProduct(productData);
        
//       } catch (error) {
//         console.error('❌ Error in fetchProduct:', error);
        
//         // Ultimate fallback
//         const ultimateFallback = {
//           _id: "1",
//           name: "Marble Ganesha Statue",
//           price: 2500,
//           moq: 25,
//           thumbnail: fallbackImages[0],
//           images: fallbackImages,
//           video360: sampleVideos[1], // ✅ VIDEO
//           category: { name: "Statues" },
//           subCategory: { name: "Ganesha" },
//           features: ["Premium Quality", "Handmade"],
//           services: ["Custom"]
//         };
        
//         setProduct(ultimateFallback);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProduct();
//     } else {
//       console.log('❌ No ID in URL');
//       router.push("/category");
//     }
//   }, [id, router]);

//   // Extract media (images + video) from product data
//   const extractMedia = () => {
//     if (!product) return { mediaItems: [], videoUrl: null };
    
//     let mediaItems = [];
//     let videoUrl = product?.video360 || null;
    
//     // Add video as first item if exists
//     if (videoUrl) {
//       mediaItems.push({ 
//         type: 'video', 
//         url: videoUrl, 
//         thumbnail: product?.thumbnail || fallbackImages[0] 
//       });
//     }
    
//     // Add product images
//     if (product.images && Array.isArray(product.images)) {
//       product.images.forEach(image => {
//         if (typeof image === 'string' && image.trim() !== '') {
//           mediaItems.push({ type: 'image', url: image });
//         }
//       });
//     }
    
//     // Add thumbnail if not already included
//     if (product.thumbnail && typeof product.thumbnail === 'string' && product.thumbnail.trim() !== '') {
//       const thumbnailExists = mediaItems.some(item => item.url === product.thumbnail);
//       if (!thumbnailExists) {
//         mediaItems.push({ type: 'image', url: product.thumbnail });
//       }
//     }
    
//     // If no media items, use fallback
//     if (mediaItems.length === 0) {
//       mediaItems = fallbackImages.map(img => ({ type: 'image', url: img }));
//     }
    
//     return { mediaItems, videoUrl };
//   };

//   const { mediaItems, videoUrl } = extractMedia();

//   // Video control functions
//   const togglePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play().catch(err => {
//           console.error('Video play error:', err);
//         });
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !videoRef.current.muted;
//       setIsMuted(videoRef.current.muted);
//       if (!videoRef.current.muted) {
//         videoRef.current.volume = volume;
//       }
//     }
//   };

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     setVolume(newVolume);
//     if (videoRef.current) {
//       videoRef.current.volume = newVolume;
//       videoRef.current.muted = newVolume === 0;
//       setIsMuted(newVolume === 0);
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       setCurrentTime(videoRef.current.currentTime);
//       setDuration(videoRef.current.duration || 0);
//     }
//   };

//   const handleProgressClick = (e) => {
//     if (videoRef.current && duration > 0) {
//       const progressBar = e.currentTarget;
//       const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
//       const progressBarWidth = progressBar.clientWidth;
//       const percentage = clickPosition / progressBarWidth;
//       const newTime = percentage * duration;
//       videoRef.current.currentTime = newTime;
//       setCurrentTime(newTime);
//     }
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       videoContainerRef.current?.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };

//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
//   }, []);

//   const nextSlide = () => {
//     if (mediaItems.length) {
//       setCurrentMediaIndex((prev) => {
//         const nextIndex = (prev + 1) % mediaItems.length;
//         if (mediaItems[prev]?.type === 'video' && videoRef.current) {
//           videoRef.current.pause();
//           setIsPlaying(false);
//         }
//         return nextIndex;
//       });
//     }
//   };
  
//   const prevSlide = () => {
//     if (mediaItems.length) {
//       setCurrentMediaIndex((prev) => {
//         const prevIndex = prev === 0 ? mediaItems.length - 1 : prev - 1;
//         if (mediaItems[prev]?.type === 'video' && videoRef.current) {
//           videoRef.current.pause();
//           setIsPlaying(false);
//         }
//         return prevIndex;
//       });
//     }
//   };

//   const handleVideoEnded = () => {
//     setIsPlaying(false);
//   };

//   const handleVideoLoaded = () => {
//     if (videoRef.current) {
//       setDuration(videoRef.current.duration);
//       videoRef.current.volume = volume;
//     }
//   };

//   // Transform backend data to match frontend structure
//   const transformProductData = () => {
//     if (!product) return null;

//     return {
//       id: product._id || "1",
//       name: product.name || "Premium Product",
//       price: product.price?.toString() || "2999",
//       moq: product.minimumOrderQuantity || product.moq || 50,
//       images: mediaItems.filter(item => item.type === 'image').map(item => item.url),
//       video360: videoUrl,
//       godName: product.godName || "Ganesha",
//       color: product.color || "Multicolor",
//       suitableFor: product.suitableFor || "Home & Office",
//       usage: product.usage || "Interior Decor",
//       posture: product.posture || "Sitting",
//       baseShape: product.baseShape || "Round",
//       finish: product.finish || "Hand Painted",
//       appearance: product.appearance || "Glossy",
//       careInstruction: product.careInstruction || "Wipe with dry cloth",
//       assemblyRequired: product.assemblyRequired || "Already Assembled",
//       availability: product.availability || "In Stock",
//       shortDescription: product.shortDescription || "Beautiful decorative statue",
//       longDescription: product.longDescription || product.description || `Enhance your space with our beautiful ${product.name}. Made with premium materials and expert craftsmanship.`,
//       features: product.features || ["Premium Quality", "Handmade", "Eco-friendly"],
//       category: product.category?.name || "Statues",
//       subCategory: product.subCategory?.name || "Ganesha"
//     };
//   };

//   const transformedProduct = transformProductData();

//   const productSpecs = [
//     { label: "Product Name", value: transformedProduct?.name },
//     { label: "Category", value: transformedProduct?.category },
//     { label: "Sub Category", value: transformedProduct?.subCategory },
//     { label: "Color", value: transformedProduct?.color },
//     { label: "Suitable For", value: transformedProduct?.suitableFor },
//     { label: "Usage/Application", value: transformedProduct?.usage },
//     { label: "Posture", value: transformedProduct?.posture },
//     { label: "Base Shape", value: transformedProduct?.baseShape },
//     { label: "Finish", value: transformedProduct?.finish },
//     { label: "Appearance", value: transformedProduct?.appearance },
//     { label: "Care Instruction", value: transformedProduct?.careInstruction },
//     { label: "Assembly Required", value: transformedProduct?.assemblyRequired },
//     { label: "Availability", value: transformedProduct?.availability },
//   ];

//   const currentMedia = mediaItems[currentMediaIndex];

//   if (loading) {
//     return (
//       <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf8e44] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading product details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product || !transformedProduct) {
//     return (
//       <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">Product not found</p>
//           <button 
//             onClick={() => router.push("/category")}
//             className="mt-4 px-6 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#a56e2e] transition-colors"
//           >
//             Back to Categories
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-[#fffcf7] min-h-screen font-sans pb-8 md:pb-20">
      
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 md:pt-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          
//           {/* LEFT COLUMN - Media Gallery */}
//           <div className="lg:col-span-7 space-y-4 md:space-y-6">
//             {/* Main Media Display */}
//             <div 
//               ref={videoContainerRef}
//               className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
//             >
//               {currentMedia?.type === 'video' ? (
//                 <div className="relative w-full h-full group">
//                   <video
//                     ref={videoRef}
//                     src={currentMedia.url}
//                     className="w-full h-full object-contain bg-black"
//                     onEnded={handleVideoEnded}
//                     onTimeUpdate={handleTimeUpdate}
//                     onLoadedData={handleVideoLoaded}
//                     playsInline
//                     preload="metadata"
//                     poster={currentMedia.thumbnail}
//                   />
                  
//                   {/* Video Controls Overlay */}
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     {/* Progress Bar */}
//                     <div 
//                       className="w-full h-1 md:h-1.5 bg-gray-600 rounded-full mb-3 md:mb-4 cursor-pointer"
//                       onClick={handleProgressClick}
//                     >
//                       <div 
//                         className="h-full bg-[#C08237] rounded-full"
//                         style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
//                       />
//                     </div>
                    
//                     {/* Control Buttons */}
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2 md:gap-4">
//                         {/* Play/Pause */}
//                         <button
//                           onClick={togglePlayPause}
//                           className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                           aria-label={isPlaying ? "Pause" : "Play"}
//                         >
//                           {isPlaying ? (
//                             <Pause size={18} className="text-white md:w-5 md:h-5" />
//                           ) : (
//                             <Play size={18} className="text-white md:w-5 md:h-5" />
//                           )}
//                         </button>
                        
//                         {/* Time Display */}
//                         <span className="text-white text-xs md:text-sm font-medium">
//                           {formatTime(currentTime)} / {formatTime(duration)}
//                         </span>
//                       </div>
                      
//                       <div className="flex items-center gap-2 md:gap-4">
//                         {/* Volume Control */}
//                         <div className="relative" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
//                           <button
//                             onClick={toggleMute}
//                             className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                             aria-label={isMuted ? "Unmute" : "Mute"}
//                           >
//                             {isMuted || volume === 0 ? (
//                               <VolumeX size={18} className="text-white md:w-5 md:h-5" />
//                             ) : (
//                               <Volume2 size={18} className="text-white md:w-5 md:h-5" />
//                             )}
//                           </button>
                          
//                           {showVolumeSlider && (
//                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 backdrop-blur-sm rounded-lg">
//                               <input
//                                 type="range"
//                                 min="0"
//                                 max="1"
//                                 step="0.1"
//                                 value={volume}
//                                 onChange={handleVolumeChange}
//                                 className="w-24 h-1.5 bg-gray-600 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C08237] [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C08237]"
//                               />
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Fullscreen */}
//                         <button
//                           onClick={toggleFullscreen}
//                           className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                           aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
//                         >
//                           <Maximize2 size={18} className="text-white md:w-5 md:h-5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Video Badge */}
//                   <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#C08237] text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                     <Play size={10} className="md:w-3 md:h-3" /> 360° VIEW
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <img 
//                     src={currentMedia?.url} 
//                     className="w-full h-full object-contain p-4"
//                     alt={transformedProduct.name}
//                     onError={(e) => {
//                       e.target.src = fallbackImages[0];
//                     }}
//                   />
//                   <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-gray-800 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
//                     IMAGE
//                   </div>
//                 </>
//               )}
              
//               {/* Navigation Arrows */}
//               {mediaItems.length > 1 && (
//                 <>
//                   <button 
//                     onClick={prevSlide} 
//                     className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all"
//                     aria-label="Previous"
//                   >
//                     <ChevronLeft size={18} className="text-gray-700 md:w-6 md:h-6" />
//                   </button>
//                   <button 
//                     onClick={nextSlide} 
//                     className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all"
//                     aria-label="Next"
//                   >
//                     <ChevronRight size={18} className="text-gray-700 md:w-6 md:h-6" />
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Thumbnails Grid - Responsive */}
//             <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2 md:gap-3">
//               {mediaItems.map((media, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => {
//                     if (media.type === 'video' && videoRef.current) {
//                       videoRef.current.pause();
//                       setIsPlaying(false);
//                     }
//                     setCurrentMediaIndex(idx);
//                   }}
//                   className={`relative aspect-square rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${currentMediaIndex === idx ? 'border-[#C08237] scale-[1.02] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
//                   aria-label={`View ${media.type} ${idx + 1}`}
//                 >
//                   {media.type === 'video' ? (
//                     <>
//                       <img 
//                         src={media.thumbnail}
//                         alt="Video thumbnail"
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//                         <Play size={14} className="text-white md:w-4 md:h-4" />
//                       </div>
//                       <div className="absolute top-1 right-1 bg-[#C08237] text-white text-[9px] md:text-[10px] px-1 py-0.5 rounded">
//                         VIDEO
//                       </div>
//                     </>
//                   ) : (
//                     <img 
//                       src={media.url} 
//                       alt={`${transformedProduct.name} thumbnail ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = fallbackImages[idx % fallbackImages.length];
//                       }}
//                     />
//                   )}
//                 </button>
//               ))}
//             </div>

//             {/* Media Information Card */}
//             <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-base md:text-lg font-semibold text-gray-800">Media Details</h3>
//                 {videoUrl && (
//                   <button className="text-xs md:text-sm text-[#C08237] font-medium hover:text-[#a56e2e] transition-colors flex items-center gap-1">
//                     <Download size={14} className="md:w-4 md:h-4" /> Download Video
//                   </button>
//                 )}
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Total Media:</span>
//                   <span className="ml-2 font-medium">{mediaItems.length} items</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">360° View:</span>
//                   <span className="ml-2 font-medium text-[#C08237]">
//                     {videoUrl ? 'Available' : 'Not Available'}
//                   </span>
//                 </div>
//                 {videoUrl && (
//                   <>
//                     <div className="sm:col-span-2 grid grid-cols-2 gap-2">
//                       <div className="bg-gray-50 p-2 rounded-lg">
//                         <span className="text-gray-600 text-xs">Video Format:</span>
//                         <span className="ml-2 font-medium text-sm">MP4</span>
//                       </div>
//                       <div className="bg-gray-50 p-2 rounded-lg">
//                         <span className="text-gray-600 text-xs">Duration:</span>
//                         <span className="ml-2 font-medium text-sm">{formatTime(duration)}</span>
//                       </div>
//                     </div>
//                   </>
//                 )}
//                 <div className="sm:col-span-2">
//                   <p className="text-gray-600 text-sm">
//                     <span className="font-medium">Tip:</span> Click on thumbnails to switch between images and 360° video view. Use video controls for playback.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN - Product Details */}
//           <div className="lg:col-span-5 space-y-4 md:space-y-6">
//             {/* Product Header */}
//             <div className="space-y-3">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
//                     {transformedProduct.name}
//                   </h1>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="text-xs md:text-sm text-gray-500">Category:</span>
//                     <span className="text-xs md:text-sm font-medium text-[#C08237]">
//                       {transformedProduct.category}
//                       {transformedProduct.subCategory && ` › ${transformedProduct.subCategory}`}
//                     </span>
//                   </div>
//                 </div>
//                 <button 
//                   className="p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors"
//                   aria-label="Add to wishlist"
//                 >
//                   <Heart size={20} className="text-gray-600 md:w-6 md:h-6" />
//                 </button>
//               </div>

//               {/* Price and MOQ Card */}
//               <div className="bg-[#F9F5F0] rounded-xl p-4 md:p-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//                   <div>
//                     <p className="text-xs md:text-sm text-gray-600">Price per piece</p>
//                     <p className="text-2xl md:text-3xl font-bold text-gray-900">₹ {transformedProduct.price}</p>
//                   </div>
//                   <div className="text-left sm:text-right">
//                     <p className="text-xs md:text-sm text-gray-600">Minimum Order Quantity</p>
//                     <p className="text-xl md:text-2xl font-bold text-[#C08237]">{transformedProduct.moq} Pieces</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => router.push(`/productInquiry?productId=${transformedProduct.id}`)}
//                   className="w-full py-3 bg-[#C08237] text-white font-semibold rounded-lg hover:bg-[#a56e2e] transition-colors text-sm md:text-base flex items-center justify-center gap-2"
//                 >
//                   <span>Send Product Inquiry</span>
//                   <ChevronRight size={18} className="md:w-5 md:h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Quick Specs Card */}
//             <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
//               <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Specifications</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {productSpecs.slice(0, 8).map((spec, idx) => (
//                   <div key={idx} className="space-y-1">
//                     <p className="text-xs md:text-sm text-gray-500">{spec.label}</p>
//                     <p className="text-sm md:text-base font-medium text-gray-800 truncate">{spec.value}</p>
//                   </div>
//                 ))}
//               </div>
//               <button 
//                 onClick={() => {
//                   document.getElementById('full-specs')?.scrollIntoView({ behavior: 'smooth' });
//                 }}
//                 className="w-full mt-4 py-2 md:py-3 text-[#C08237] font-medium border border-[#C08237] rounded-lg hover:bg-[#C08237] hover:text-white transition-colors text-sm md:text-base"
//               >
//                 View All Specifications
//               </button>
//             </div>

//             {/* Product Description Card */}
//             <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
//               <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
//               <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
//                 {transformedProduct.shortDescription}
//               </p>
//               <div className="space-y-2">
//                 <h4 className="font-medium text-gray-800 text-sm md:text-base">Key Features:</h4>
//                 <ul className="space-y-2">
//                   {transformedProduct.features.map((feature, idx) => (
//                     <li key={idx} className="flex items-start gap-2">
//                       <div className="w-1.5 h-1.5 bg-[#C08237] rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
//                       <span className="text-sm text-gray-600">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             {/* Bulk Order Benefits Card */}
//             <div className="bg-gradient-to-r from-[#F9F5F0] to-[#FFF4E6] rounded-xl p-4 md:p-5 border border-[#E8D9C3]">
//               <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Bulk Order Benefits</h3>
//               <div className="space-y-3">
//                 {[
//                   { title: "Wholesale Prices", desc: "Significant cost savings for bulk orders" },
//                   { title: "Custom Design Support", desc: "Tailored solutions for your business needs" },
//                   { title: "Private Labeling", desc: "Brand products with your own logo" },
//                   { title: "Priority Shipping", desc: "Faster delivery for bulk orders" }
//                 ].map((benefit, idx) => (
//                   <div key={idx} className="flex items-start gap-3">
//                     <div className="w-6 h-6 md:w-7 md:h-7 bg-[#C08237] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <span className="text-white font-bold text-xs md:text-sm">✓</span>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-800 text-sm md:text-base">{benefit.title}</p>
//                       <p className="text-xs md:text-sm text-gray-600">{benefit.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Video Info Card (If video exists) */}
//             {videoUrl && (
//               <div className="bg-blue-50 rounded-xl p-4 md:p-5 border border-blue-100">
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="w-8 h-8 bg-[#C08237] rounded-full flex items-center justify-center">
//                     <Play size={16} className="text-white" />
//                   </div>
//                   <h3 className="text-base md:text-lg font-semibold text-gray-800">360° View Available</h3>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-3">
//                   Experience this product in 360° view. Rotate, zoom and explore every angle before making a decision.
//                 </p>
//                 <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
//                   <Settings size={14} className="md:w-4 md:h-4" />
//                   <span>Use mouse/touch to rotate • Scroll to zoom • Click play to start</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Full Specifications Section */}
//         <div id="full-specs" className="mt-8 md:mt-12 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-4 md:mb-6">
//             <h3 className="text-xl md:text-2xl font-bold text-gray-900">Complete Product Specifications</h3>
//             <button className="text-xs md:text-sm text-[#C08237] font-medium hover:text-[#a56e2e] transition-colors">
//               Print Specifications
//             </button>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//             {productSpecs.map((spec, idx) => (
//               <div key={idx} className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                 <p className="text-xs md:text-sm text-gray-500 font-medium mb-1">{spec.label}</p>
//                 <p className="text-sm md:text-base font-semibold text-gray-800">{spec.value}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       <div className='my-6 md:my-8 px-3 sm:px-4 md:px-0'>
//         <ProductInquiry/>
//       </div>

//       <div className='my-6 md:my-8 px-3 sm:px-4 md:px-0'>
//         <WhyChooseSection/>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;


// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { Heart, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, Settings, Download, X, Check } from 'lucide-react';
// import ProductInquiry from '../../productInquiry/page.jsx';
// import WhyChooseSection from '../../components/WhyChooseSection.jsx';
// import { useParams, useRouter } from "next/navigation";

// const ProductDetailPage = () => {
//     const { id } = useParams();
//     const router = useRouter();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isMuted, setIsMuted] = useState(true);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [volume, setVolume] = useState(0.5);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [showVolumeSlider, setShowVolumeSlider] = useState(false);
//     const [selectedSize, setSelectedSize] = useState("Small");
//     const [quantity, setQuantity] = useState(1);
//     const [showInquiryModal, setShowInquiryModal] = useState(false);
//     const videoRef = useRef(null);
//     const videoContainerRef = useRef(null);

//     // Fallback images
//     const fallbackImages = [
//         "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
//         "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
//         "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
//     ];

//     // Sample video URLs
//     const sampleVideos = [
//         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
//     ];

//     // Fetch product data
//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 setLoading(true);
//                 console.log('🆔 Fetching product with ID:', id);
                
//                 let productData = null;
                
//                 try {
//                     // Try to fetch single product
//                     const response = await fetch(`/api/admin/products/${id}`);
//                     if (response.ok) {
//                         const data = await response.json();
//                         if (data.success && data.data) {
//                             productData = data.data;
//                         } else {
//                             // Fallback: Fetch all products
//                             const allProductsResponse = await fetch('/api/admin/products');
//                             if (allProductsResponse.ok) {
//                                 const allProducts = await allProductsResponse.json();
//                                 if (allProducts.success && allProducts.data) {
//                                     productData = allProducts.data.find(p => p._id === id);
//                                 }
//                             }
//                         }
//                     }
//                 } catch (apiError) {
//                     console.log('❌ API Error:', apiError.message);
//                 }
                
//                 // If no data from API, use mock data with video
//                 if (!productData) {
//                     console.log('🔄 Using mock data with video');
//                     productData = {
//                         _id: id || "1",
//                         name: "Premium Marble Ganesha Statue",
//                         price: 2999,
//                         moq: 50,
//                         minimumOrderQuantity: 50,
//                         thumbnail: fallbackImages[0],
//                         images: fallbackImages,
//                         video360: sampleVideos[0], // ✅ VIDEO INCLUDED
//                         category: { 
//                             _id: "cat1", 
//                             name: "Statues" 
//                         },
//                         subCategory: { 
//                             _id: "sub1", 
//                             name: "Ganesha" 
//                         },
//                         finish: "Hand Painted",
//                         productType: "Ready Stock",
//                         services: ["Custom Design", "Private Label"],
//                         features: [
//                             "Hand carved from premium marble",
//                             "Eco-friendly materials",
//                             "Expert craftsmanship",
//                             "Perfect for home and office decor",
//                             "Makes an excellent gift"
//                         ],
//                         godName: "Ganesha",
//                         color: "White & Gold",
//                         suitableFor: "Home & Office",
//                         usage: "Interior Decor, Gift, Worship",
//                         posture: "Sitting",
//                         baseShape: "Round",
//                         appearance: "Glossy",
//                         careInstruction: "Wipe with dry cloth, Keep away from water",
//                         assemblyRequired: "Already Assembled",
//                         availability: "In Stock",
//                         shortDescription: "Beautiful marble Ganesha statue for spiritual and decorative purposes",
//                         longDescription: "This exquisite marble statue of Lord Ganesha is meticulously hand-carved by skilled artisans. Made from premium quality marble, it features intricate detailing and a beautiful finish. Perfect for home decor, office spaces, or as a spiritual centerpiece. The statue brings positive energy and prosperity to any space.",
//                         description: "Premium quality marble statue of Lord Ganesha for home and office decor",
//                         sizes: [
//                             { name: "Small", dimensions: "6x6 inches", price: 1999 },
//                             { name: "Medium", dimensions: "12x12 inches", price: 2999 },
//                             { name: "Large", dimensions: "18x18 inches", price: 4999 }
//                         ]
//                     };
//                 }
                
//                 // Ensure all media fields exist
//                 productData = {
//                     ...productData,
//                     thumbnail: productData.thumbnail || fallbackImages[0],
//                     images: Array.isArray(productData.images) ? productData.images : 
//                            productData.image ? [productData.image] : fallbackImages,
//                     video360: productData.video360 || sampleVideos[0] // ✅ Always include video
//                 };
                
//                 console.log('✅ Final Product Data with Video:', productData);
//                 setProduct(productData);
                
//             } catch (error) {
//                 console.error('❌ Error in fetchProduct:', error);
                
//                 // Ultimate fallback with video
//                 const ultimateFallback = {
//                     _id: id || "1",
//                     name: "Marble Ganesha Statue",
//                     price: 2500,
//                     moq: 25,
//                     thumbnail: fallbackImages[0],
//                     images: fallbackImages,
//                     video360: sampleVideos[0], // ✅ VIDEO
//                     category: { name: "Statues" },
//                     subCategory: { name: "Ganesha" },
//                     features: ["Premium Quality", "Handmade"],
//                     services: ["Custom"],
//                     sizes: [
//                         { name: "Small", dimensions: "6x6 inches", price: 1999 },
//                         { name: "Medium", dimensions: "12x12 inches", price: 2999 },
//                         { name: "Large", dimensions: "18x18 inches", price: 4999 }
//                     ]
//                 };
                
//                 setProduct(ultimateFallback);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchProduct();
//         } else {
//             console.log('❌ No ID in URL');
//             router.push("/category");
//         }
//     }, [id, router]);

//     // Extract media from product - VIDEO FIRST
//     const extractMedia = () => {
//         if (!product) return { mediaItems: [], videoUrl: null };
        
//         let mediaItems = [];
//         const thumbnail = product.thumbnail || fallbackImages[0];
        
//         // ✅ VIDEO FIRST in the media list
//         if (product.video360) {
//             mediaItems.push({ 
//                 type: 'video', 
//                 url: product.video360, 
//                 thumbnail: thumbnail,
//                 title: '360° Product View'
//             });
//         }
        
//         // Add thumbnail as first image
//         mediaItems.push({ 
//             type: 'image', 
//             url: thumbnail,
//             isThumbnail: true
//         });
        
//         // Add other images
//         if (product.images && Array.isArray(product.images)) {
//             product.images.forEach((image, index) => {
//                 if (image && image !== thumbnail) {
//                     mediaItems.push({ 
//                         type: 'image', 
//                         url: image,
//                         index: index
//                     });
//                 }
//             });
//         }
        
//         // Ensure at least one item
//         if (mediaItems.length === 0) {
//             mediaItems.push({ type: 'image', url: fallbackImages[0] });
//         }
        
//         return { 
//             mediaItems, 
//             videoUrl: product.video360,
//             thumbnail 
//         };
//     };

//     const { mediaItems, videoUrl, thumbnail } = extractMedia();
//     const currentMedia = mediaItems[currentMediaIndex];

//     // Video control functions
//     const togglePlayPause = () => {
//         if (videoRef.current) {
//             if (isPlaying) {
//                 videoRef.current.pause();
//             } else {
//                 videoRef.current.play().catch(err => {
//                     console.error('Video play error:', err);
//                 });
//             }
//             setIsPlaying(!isPlaying);
//         }
//     };

//     const toggleMute = () => {
//         if (videoRef.current) {
//             videoRef.current.muted = !videoRef.current.muted;
//             setIsMuted(videoRef.current.muted);
//             if (!videoRef.current.muted) {
//                 videoRef.current.volume = volume;
//             }
//         }
//     };

//     const handleVolumeChange = (e) => {
//         const newVolume = parseFloat(e.target.value);
//         setVolume(newVolume);
//         if (videoRef.current) {
//             videoRef.current.volume = newVolume;
//             videoRef.current.muted = newVolume === 0;
//             setIsMuted(newVolume === 0);
//         }
//     };

//     const handleTimeUpdate = () => {
//         if (videoRef.current) {
//             setCurrentTime(videoRef.current.currentTime);
//             setDuration(videoRef.current.duration || 0);
//         }
//     };

//     const handleProgressClick = (e) => {
//         if (videoRef.current && duration > 0) {
//             const progressBar = e.currentTarget;
//             const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
//             const progressBarWidth = progressBar.clientWidth;
//             const percentage = clickPosition / progressBarWidth;
//             const newTime = percentage * duration;
//             videoRef.current.currentTime = newTime;
//             setCurrentTime(newTime);
//         }
//     };

//     const formatTime = (time) => {
//         const minutes = Math.floor(time / 60);
//         const seconds = Math.floor(time % 60);
//         return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//     };

//     const toggleFullscreen = () => {
//         if (!document.fullscreenElement) {
//             videoContainerRef.current?.requestFullscreen();
//             setIsFullscreen(true);
//         } else {
//             document.exitFullscreen();
//             setIsFullscreen(false);
//         }
//     };

//     useEffect(() => {
//         const handleFullscreenChange = () => {
//             setIsFullscreen(!!document.fullscreenElement);
//         };

//         document.addEventListener('fullscreenchange', handleFullscreenChange);
//         return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     }, []);

//     const nextSlide = () => {
//         if (mediaItems.length) {
//             setCurrentMediaIndex((prev) => {
//                 const nextIndex = (prev + 1) % mediaItems.length;
//                 if (mediaItems[prev]?.type === 'video' && videoRef.current) {
//                     videoRef.current.pause();
//                     setIsPlaying(false);
//                 }
//                 return nextIndex;
//             });
//         }
//     };
    
//     const prevSlide = () => {
//         if (mediaItems.length) {
//             setCurrentMediaIndex((prev) => {
//                 const prevIndex = prev === 0 ? mediaItems.length - 1 : prev - 1;
//                 if (mediaItems[prev]?.type === 'video' && videoRef.current) {
//                     videoRef.current.pause();
//                     setIsPlaying(false);
//                 }
//                 return prevIndex;
//             });
//         }
//     };

//     const handleVideoEnded = () => {
//         setIsPlaying(false);
//         // Auto-play next media if video ends
//         setTimeout(() => {
//             nextSlide();
//         }, 1000);
//     };

//     const handleVideoLoaded = () => {
//         if (videoRef.current) {
//             setDuration(videoRef.current.duration);
//             videoRef.current.volume = volume;
//         }
//     };

//     // Handle video error
//     const handleVideoError = (e) => {
//         console.error('Video error:', e);
//         // Try fallback video
//         if (currentMedia.url === sampleVideos[0]) {
//             e.target.src = sampleVideos[1];
//         }
//     };

//     // Transform product data
//     const transformProductData = () => {
//         if (!product) return null;

//         return {
//             id: product._id || "1",
//             name: product.name || "Premium Product",
//             price: product.price?.toString() || "2999",
//             moq: product.minimumOrderQuantity || product.moq || 50,
//             images: mediaItems.filter(item => item.type === 'image').map(item => item.url),
//             video360: videoUrl,
//             godName: product.godName || "Ganesha",
//             color: product.color || "Multicolor",
//             suitableFor: product.suitableFor || "Home & Office",
//             usage: product.usage || "Interior Decor",
//             posture: product.posture || "Sitting",
//             baseShape: product.baseShape || "Round",
//             finish: product.finish || "Hand Painted",
//             appearance: product.appearance || "Glossy",
//             careInstruction: product.careInstruction || "Wipe with dry cloth",
//             assemblyRequired: product.assemblyRequired || "Already Assembled",
//             availability: product.availability || "In Stock",
//             shortDescription: product.shortDescription || "Beautiful decorative statue",
//             longDescription: product.longDescription || product.description || `Enhance your space with our beautiful ${product.name}.`,
//             features: product.features || ["Premium Quality", "Handmade", "Eco-friendly"],
//             category: product.category?.name || "Statues",
//             subCategory: product.subCategory?.name || "Ganesha",
//             sizes: product.sizes || [
//                 { name: "Small", dimensions: "6x6 inches", price: 1999 },
//                 { name: "Medium", dimensions: "12x12 inches", price: 2999 },
//                 { name: "Large", dimensions: "18x18 inches", price: 4999 }
//             ]
//         };
//     };

//     const transformedProduct = transformProductData();

//     const productSpecs = [
//         { label: "Product Name", value: transformedProduct?.name },
//         { label: "Category", value: transformedProduct?.category },
//         { label: "Sub Category", value: transformedProduct?.subCategory },
//         { label: "Color", value: transformedProduct?.color },
//         { label: "Suitable For", value: transformedProduct?.suitableFor },
//         { label: "Usage/Application", value: transformedProduct?.usage },
//         { label: "Posture", value: transformedProduct?.posture },
//         { label: "Base Shape", value: transformedProduct?.baseShape },
//         { label: "Finish", value: transformedProduct?.finish },
//         { label: "Appearance", value: transformedProduct?.appearance },
//         { label: "Care Instruction", value: transformedProduct?.careInstruction },
//         { label: "Assembly Required", value: transformedProduct?.assemblyRequired },
//         { label: "Availability", value: transformedProduct?.availability },
//     ];

//     // Get selected size price
//     const getSelectedPrice = () => {
//         if (transformedProduct?.sizes) {
//             const selected = transformedProduct.sizes.find(size => size.name === selectedSize);
//             return selected ? selected.price : transformedProduct.price;
//         }
//         return transformedProduct?.price;
//     };

//     const selectedPrice = getSelectedPrice();

//     if (loading) {
//         return (
//             <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf8e44] mx-auto"></div>
//                     <p className="mt-4 text-gray-600">Loading product details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!product || !transformedProduct) {
//         return (
//             <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-600">Product not found</p>
//                     <button 
//                         onClick={() => router.push("/category")}
//                         className="mt-4 px-6 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#a56e2e] transition-colors"
//                     >
//                         Back to Categories
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full bg-[#fffcf7] min-h-screen font-sans pb-8 md:pb-20">
//             <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 md:pt-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
//                     {/* LEFT COLUMN - Media Gallery */}
//                     <div className="lg:col-span-7 space-y-4 md:space-y-6">
//                         {/* Main Media Display */}
//                         <div 
//                             ref={videoContainerRef}
//                             className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
//                         >
//                             {currentMedia?.type === 'video' ? (
//                                 <div className="relative w-full h-full group">
//                                     <video
//                                         ref={videoRef}
//                                         src={currentMedia.url}
//                                         className="w-full h-full object-contain bg-black"
//                                         onEnded={handleVideoEnded}
//                                         onTimeUpdate={handleTimeUpdate}
//                                         onLoadedData={handleVideoLoaded}
//                                         onError={handleVideoError}
//                                         playsInline
//                                         preload="metadata"
//                                         poster={currentMedia.thumbnail}
//                                         controls={false}
//                                     />
                                    
//                                     {/* Video Controls Overlay */}
//                                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                         {/* Progress Bar */}
//                                         <div 
//                                             className="w-full h-1 md:h-1.5 bg-gray-600 rounded-full mb-3 md:mb-4 cursor-pointer"
//                                             onClick={handleProgressClick}
//                                         >
//                                             <div 
//                                                 className="h-full bg-[#C08237] rounded-full"
//                                                 style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
//                                             />
//                                         </div>
                                        
//                                         {/* Control Buttons */}
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center gap-2 md:gap-4">
//                                                 {/* Play/Pause */}
//                                                 <button
//                                                     onClick={togglePlayPause}
//                                                     className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                                                     aria-label={isPlaying ? "Pause" : "Play"}
//                                                 >
//                                                     {isPlaying ? (
//                                                         <Pause size={18} className="text-white md:w-5 md:h-5" />
//                                                     ) : (
//                                                         <Play size={18} className="text-white md:w-5 md:h-5" />
//                                                     )}
//                                                 </button>
                                                
//                                                 {/* Time Display */}
//                                                 <span className="text-white text-xs md:text-sm font-medium">
//                                                     {formatTime(currentTime)} / {formatTime(duration)}
//                                                 </span>
//                                             </div>
                                            
//                                             <div className="flex items-center gap-2 md:gap-4">
//                                                 {/* Volume Control */}
//                                                 <div className="relative" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
//                                                     <button
//                                                         onClick={toggleMute}
//                                                         className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                                                         aria-label={isMuted ? "Unmute" : "Mute"}
//                                                     >
//                                                         {isMuted || volume === 0 ? (
//                                                             <VolumeX size={18} className="text-white md:w-5 md:h-5" />
//                                                         ) : (
//                                                             <Volume2 size={18} className="text-white md:w-5 md:h-5" />
//                                                         )}
//                                                     </button>
                                                    
//                                                     {showVolumeSlider && (
//                                                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 backdrop-blur-sm rounded-lg z-10">
//                                                             <input
//                                                                 type="range"
//                                                                 min="0"
//                                                                 max="1"
//                                                                 step="0.1"
//                                                                 value={volume}
//                                                                 onChange={handleVolumeChange}
//                                                                 className="w-24 h-1.5 bg-gray-600 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C08237] [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C08237]"
//                                                             />
//                                                         </div>
//                                                     )}
//                                                 </div>
                                                
//                                                 {/* Fullscreen */}
//                                                 <button
//                                                     onClick={toggleFullscreen}
//                                                     className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                                                     aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
//                                                 >
//                                                     <Maximize2 size={18} className="text-white md:w-5 md:h-5" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
                                    
//                                     {/* Video Badge */}
//                                     <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#C08237] text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                                         <Play size={10} className="md:w-3 md:h-3" /> 360° VIEW
//                                     </div>
                                    
//                                     {/* Play Button Overlay when paused */}
//                                     {!isPlaying && (
//                                         <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                                             <button
//                                                 onClick={togglePlayPause}
//                                                 className="w-16 h-16 md:w-20 md:h-20 bg-[#C08237]/90 rounded-full flex items-center justify-center hover:bg-[#C08237] transition-colors"
//                                             >
//                                                 <Play size={32} className="text-white ml-1" />
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                                         <img 
//                                             src={currentMedia?.url} 
//                                             className="w-full h-full object-contain p-4"
//                                             alt={transformedProduct.name}
//                                             onError={(e) => {
//                                                 console.log('Image failed to load:', currentMedia?.url);
//                                                 if (thumbnail && thumbnail !== currentMedia?.url) {
//                                                     e.target.src = thumbnail;
//                                                 } else if (fallbackImages[0]) {
//                                                     e.target.src = fallbackImages[0];
//                                                 }
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-gray-800 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
//                                         IMAGE
//                                     </div>
//                                 </>
//                             )}
                            
//                             {/* Navigation Arrows */}
//                             {mediaItems.length > 1 && (
//                                 <>
//                                     <button 
//                                         onClick={prevSlide} 
//                                         className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
//                                         aria-label="Previous"
//                                     >
//                                         <ChevronLeft size={18} className="text-gray-700 md:w-6 md:h-6" />
//                                     </button>
//                                     <button 
//                                         onClick={nextSlide} 
//                                         className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
//                                         aria-label="Next"
//                                     >
//                                         <ChevronRight size={18} className="text-gray-700 md:w-6 md:h-6" />
//                                     </button>
//                                 </>
//                             )}
//                         </div>

//                         {/* Thumbnails Grid - Responsive */}
//                         <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2 md:gap-3">
//                             {mediaItems.map((media, idx) => (
//                                 <button
//                                     key={idx}
//                                     onClick={() => {
//                                         if (media.type === 'video' && videoRef.current) {
//                                             videoRef.current.pause();
//                                             setIsPlaying(false);
//                                         }
//                                         setCurrentMediaIndex(idx);
//                                     }}
//                                     className={`relative aspect-square rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${currentMediaIndex === idx ? 'border-[#C08237] scale-[1.02] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
//                                     aria-label={`View ${media.type} ${idx + 1}`}
//                                 >
//                                     {media.type === 'video' ? (
//                                         <>
//                                             <img 
//                                                 src={media.thumbnail || thumbnail}
//                                                 alt="Video thumbnail"
//                                                 className="w-full h-full object-cover"
//                                             />
//                                             <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//                                                 <Play size={14} className="text-white md:w-4 md:h-4" />
//                                             </div>
//                                             <div className="absolute top-1 right-1 bg-[#C08237] text-white text-[9px] md:text-[10px] px-1 py-0.5 rounded">
//                                                 VIDEO
//                                             </div>
//                                         </>
//                                     ) : (
//                                         <img 
//                                             src={media.url} 
//                                             alt={`${transformedProduct.name} thumbnail ${idx + 1}`}
//                                             className="w-full h-full object-cover"
//                                             onError={(e) => {
//                                                 e.target.src = fallbackImages[idx % fallbackImages.length];
//                                             }}
//                                         />
//                                     )}
//                                 </button>
//                             ))}
//                         </div>

//                         {/* Media Information Card */}
//                         <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
//                             <div className="flex items-center justify-between mb-3">
//                                 <h3 className="text-base md:text-lg font-semibold text-gray-800">Media Details</h3>
//                                 {videoUrl && (
//                                     <button className="text-xs md:text-sm text-[#C08237] font-medium hover:text-[#a56e2e] transition-colors flex items-center gap-1">
//                                         <Download size={14} className="md:w-4 md:h-4" /> Download Video
//                                     </button>
//                                 )}
//                             </div>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
//                                 <div>
//                                     <span className="text-gray-600">Total Media:</span>
//                                     <span className="ml-2 font-medium">{mediaItems.length} items</span>
//                                 </div>
//                                 <div>
//                                     <span className="text-gray-600">360° View:</span>
//                                     <span className="ml-2 font-medium text-[#C08237]">
//                                         {videoUrl ? 'Available' : 'Not Available'}
//                                     </span>
//                                 </div>
//                                 {videoUrl && (
//                                     <>
//                                         <div className="sm:col-span-2 grid grid-cols-2 gap-2">
//                                             <div className="bg-gray-50 p-2 rounded-lg">
//                                                 <span className="text-gray-600 text-xs">Video Format:</span>
//                                                 <span className="ml-2 font-medium text-sm">MP4</span>
//                                             </div>
//                                             <div className="bg-gray-50 p-2 rounded-lg">
//                                                 <span className="text-gray-600 text-xs">Duration:</span>
//                                                 <span className="ml-2 font-medium text-sm">{formatTime(duration)}</span>
//                                             </div>
//                                         </div>
//                                     </>
//                                 )}
//                                 <div className="sm:col-span-2">
//                                     <p className="text-gray-600 text-sm">
//                                         <span className="font-medium">Tip:</span> Click on thumbnails to switch between images and 360° video view. Use video controls for playback.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* RIGHT COLUMN - Product Details */}
//                     <div className="lg:col-span-5 space-y-4 md:space-y-6">
//                         {/* Product Header */}
//                         <div className="space-y-3">
//                             <div className="flex items-start justify-between">
//                                 <div className="flex-1">
//                                     <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
//                                         {transformedProduct.name}
//                                     </h1>
//                                     <div className="flex items-center gap-2 mt-2">
//                                         <span className="text-xs md:text-sm text-gray-500">Category:</span>
//                                         <span className="text-xs md:text-sm font-medium text-[#C08237]">
//                                             {transformedProduct.category}
//                                             {transformedProduct.subCategory && ` › ${transformedProduct.subCategory}`}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <button 
//                                     className="p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors"
//                                     aria-label="Add to wishlist"
//                                 >
//                                     <Heart size={20} className="text-gray-600 md:w-6 md:h-6" />
//                                 </button>
//                             </div>

//                             {/* Price and MOQ Card */}
//                             <div className="bg-[#F9F5F0] rounded-xl p-4 md:p-6">
//                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//                                     <div>
//                                         <p className="text-xs md:text-sm text-gray-600">Price per piece</p>
//                                         <p className="text-2xl md:text-3xl font-bold text-gray-900">₹ {selectedPrice}</p>
//                                     </div>
//                                     <div className="text-left sm:text-right">
//                                         <p className="text-xs md:text-sm text-gray-600">Minimum Order Quantity</p>
//                                         <p className="text-xl md:text-2xl font-bold text-[#C08237]">{transformedProduct.moq} Pieces</p>
//                                     </div>
//                                 </div>
                                
//                                 {/* Size Selection */}
//                                 {transformedProduct.sizes && transformedProduct.sizes.length > 0 && (
//                                     <div className="mb-4">
//                                         <p className="text-sm font-medium text-gray-700 mb-2">Select Size:</p>
//                                         <div className="flex flex-wrap gap-2">
//                                             {transformedProduct.sizes.map((size) => (
//                                                 <button
//                                                     key={size.name}
//                                                     onClick={() => setSelectedSize(size.name)}
//                                                     className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === size.name ? 'bg-[#C08237] text-white border-[#C08237]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#C08237]'}`}
//                                                 >
//                                                     {size.name} - {size.dimensions}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
                                
//                                 {/* Quantity Selector */}
//                                 <div className="mb-4">
//                                     <p className="text-sm font-medium text-gray-700 mb-2">Quantity:</p>
//                                     <div className="flex items-center gap-3">
//                                         <div className="flex items-center border border-gray-300 rounded-lg">
//                                             <button 
//                                                 onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
//                                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
//                                             >
//                                                 -
//                                             </button>
//                                             <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center font-medium">
//                                                 {quantity}
//                                             </span>
//                                             <button 
//                                                 onClick={() => setQuantity(prev => prev + 1)}
//                                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
//                                             >
//                                                 +
//                                             </button>
//                                         </div>
//                                         <div className="text-sm text-gray-600">
//                                             Total: <span className="font-bold text-[#C08237]">₹ {selectedPrice * quantity}</span>
//                                         </div>
//                                     </div>
//                                 </div>
                                
//                                 <button
//                                     onClick={() => setShowInquiryModal(true)}
//                                     className="w-full py-3 bg-[#C08237] text-white font-semibold rounded-lg hover:bg-[#a56e2e] transition-colors text-sm md:text-base flex items-center justify-center gap-2"
//                                 >
//                                     <span>Send Product Inquiry</span>
//                                     <ChevronRight size={18} className="md:w-5 md:h-5" />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Quick Specs Card */}
//                         <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
//                             <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Specifications</h3>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                 {productSpecs.slice(0, 8).map((spec, idx) => (
//                                     <div key={idx} className="space-y-1">
//                                         <p className="text-xs md:text-sm text-gray-500">{spec.label}</p>
//                                         <p className="text-sm md:text-base font-medium text-gray-800 truncate">{spec.value}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                             <button 
//                                 onClick={() => {
//                                     document.getElementById('full-specs')?.scrollIntoView({ behavior: 'smooth' });
//                                 }}
//                                 className="w-full mt-4 py-2 md:py-3 text-[#C08237] font-medium border border-[#C08237] rounded-lg hover:bg-[#C08237] hover:text-white transition-colors text-sm md:text-base"
//                             >
//                                 View All Specifications
//                             </button>
//                         </div>

//                         {/* Product Description Card */}
//                         <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
//                             <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
//                             <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
//                                 {transformedProduct.shortDescription}
//                             </p>
//                             <div className="space-y-2">
//                                 <h4 className="font-medium text-gray-800 text-sm md:text-base">Key Features:</h4>
//                                 <ul className="space-y-2">
//                                     {transformedProduct.features.map((feature, idx) => (
//                                         <li key={idx} className="flex items-start gap-2">
//                                             <div className="w-1.5 h-1.5 bg-[#C08237] rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
//                                             <span className="text-sm text-gray-600">{feature}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         {/* Bulk Order Benefits Card */}
//                         <div className="bg-gradient-to-r from-[#F9F5F0] to-[#FFF4E6] rounded-xl p-4 md:p-5 border border-[#E8D9C3]">
//                             <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Bulk Order Benefits</h3>
//                             <div className="space-y-3">
//                                 {[
//                                     { title: "Wholesale Prices", desc: "Significant cost savings for bulk orders" },
//                                     { title: "Custom Design Support", desc: "Tailored solutions for your business needs" },
//                                     { title: "Private Labeling", desc: "Brand products with your own logo" },
//                                     { title: "Priority Shipping", desc: "Faster delivery for bulk orders" }
//                                 ].map((benefit, idx) => (
//                                     <div key={idx} className="flex items-start gap-3">
//                                         <div className="w-6 h-6 md:w-7 md:h-7 bg-[#C08237] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                                             <span className="text-white font-bold text-xs md:text-sm">✓</span>
//                                         </div>
//                                         <div>
//                                             <p className="font-medium text-gray-800 text-sm md:text-base">{benefit.title}</p>
//                                             <p className="text-xs md:text-sm text-gray-600">{benefit.desc}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Video Info Card */}
//                         {videoUrl && (
//                             <div className="bg-blue-50 rounded-xl p-4 md:p-5 border border-blue-100">
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <div className="w-8 h-8 bg-[#C08237] rounded-full flex items-center justify-center">
//                                         <Play size={16} className="text-white" />
//                                     </div>
//                                     <h3 className="text-base md:text-lg font-semibold text-gray-800">360° View Available</h3>
//                                 </div>
//                                 <p className="text-sm text-gray-600 mb-3">
//                                     Experience this product in 360° view. Rotate, zoom and explore every angle before making a decision.
//                                 </p>
//                                 <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
//                                     <Settings size={14} className="md:w-4 md:h-4" />
//                                     <span>Use mouse/touch to rotate • Scroll to zoom • Click play to start</span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Full Specifications Section */}
//                 <div id="full-specs" className="mt-8 md:mt-12 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
//                     <div className="flex items-center justify-between mb-4 md:mb-6">
//                         <h3 className="text-xl md:text-2xl font-bold text-gray-900">Complete Product Specifications</h3>
//                         <button className="text-xs md:text-sm text-[#C08237] font-medium hover:text-[#a56e2e] transition-colors">
//                             Print Specifications
//                         </button>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//                         {productSpecs.map((spec, idx) => (
//                             <div key={idx} className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                                 <p className="text-xs md:text-sm text-gray-500 font-medium mb-1">{spec.label}</p>
//                                 <p className="text-sm md:text-base font-semibold text-gray-800">{spec.value}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
            
//             {/* Product Inquiry Modal */}
//             {showInquiryModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-xl max-w-md w-full p-6">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-xl font-bold text-gray-900">Product Inquiry</h3>
//                             <button 
//                                 onClick={() => setShowInquiryModal(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-full"
//                             >
//                                 <X size={20} />
//                             </button>
//                         </div>
//                         <div className="space-y-4">
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-1">Product:</p>
//                                 <p className="font-medium">{transformedProduct.name}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-1">Selected Size:</p>
//                                 <p className="font-medium">{selectedSize}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-1">Quantity:</p>
//                                 <p className="font-medium">{quantity} pieces</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-1">Total Amount:</p>
//                                 <p className="text-xl font-bold text-[#C08237]">₹ {selectedPrice * quantity}</p>
//                             </div>
//                             <button
//                                 onClick={() => {
//                                     setShowInquiryModal(false);
//                                     router.push(`/productInquiry?productId=${transformedProduct.id}&size=${selectedSize}&quantity=${quantity}`);
//                                 }}
//                                 className="w-full py-3 bg-[#C08237] text-white font-semibold rounded-lg hover:bg-[#a56e2e] transition-colors"
//                             >
//                                 Proceed to Inquiry Form
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
            
//             <div className='my-6 md:my-8 px-3 sm:px-4 md:px-0'>
//                 <ProductInquiry/>
//             </div>

//             <div className='my-6 md:my-8 px-3 sm:px-4 md:px-0'>
//                 <WhyChooseSection/>
//             </div>
//         </div>
//     );
// };

// export default ProductDetailPage;

// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { Heart, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, Settings, Download, X } from 'lucide-react';
// import ProductInquiry from '../../productInquiry/page.jsx';
// import WhyChooseSection from '../../components/WhyChooseSection.jsx';
// import { useParams, useRouter } from "next/navigation";

// const ProductDetailPage = () => {
//     const { id } = useParams();
//     const router = useRouter();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isMuted, setIsMuted] = useState(true);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [volume, setVolume] = useState(0.5);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [showVolumeSlider, setShowVolumeSlider] = useState(false);
//     const [quantity, setQuantity] = useState(1);
//     const [showInquiryModal, setShowInquiryModal] = useState(false);
//     const videoRef = useRef(null);
//     const videoContainerRef = useRef(null);

//     // Fallback images
//     const fallbackImages = [
//         "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
//         "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
//         "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
//     ];

//     // Sample video URLs
//     const sampleVideos = [
//         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
//     ];

//     // Fetch product data
//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 setLoading(true);
//                 console.log('🆔 Fetching product with ID:', id);
                
//                 let productData = null;
                
//                 try {
//                     // Try to fetch single product
//                     const response = await fetch(`/api/admin/products/${id}`);
//                     if (response.ok) {
//                         const data = await response.json();
//                         if (data.success && data.data) {
//                             productData = data.data;
//                         } else {
//                             // Fallback: Fetch all products
//                             const allProductsResponse = await fetch('/api/admin/products');
//                             if (allProductsResponse.ok) {
//                                 const allProducts = await allProductsResponse.json();
//                                 if (allProducts.success && allProducts.data) {
//                                     productData = allProducts.data.find(p => p._id === id);
//                                 }
//                             }
//                         }
//                     }
//                 } catch (apiError) {
//                     console.log('❌ API Error:', apiError.message);
//                 }
                
//                 // If no data from API, use mock data with video
//                 if (!productData) {
//                     console.log('🔄 Using mock data with video');
//                     productData = {
//                         _id: id || "1",
//                         name: "Premium Marble Ganesha Statue",
//                         price: 2999,
//                         moq: 50,
//                         minimumOrderQuantity: 50,
//                         thumbnail: fallbackImages[0],
//                         images: fallbackImages,
//                         video360: sampleVideos[0],
//                         category: { 
//                             _id: "cat1", 
//                             name: "Statues" 
//                         },
//                         subCategory: { 
//                             _id: "sub1", 
//                             name: "Ganesha" 
//                         },
//                         finish: "Hand Painted",
//                         productType: "Ready Stock",
//                         services: ["Custom Design", "Private Label"],
//                         features: [
//                             "Hand carved from premium marble",
//                             "Eco-friendly materials",
//                             "Expert craftsmanship",
//                             "Perfect for home and office decor",
//                             "Makes an excellent gift"
//                         ],
//                         godName: "Ganesha",
//                         color: "White & Gold",
//                         suitableFor: "Home & Office",
//                         usage: "Interior Decor, Gift, Worship",
//                         posture: "Sitting",
//                         baseShape: "Round",
//                         appearance: "Glossy",
//                         careInstruction: "Wipe with dry cloth, Keep away from water",
//                         assemblyRequired: "Already Assembled",
//                         availability: "In Stock",
//                         shortDescription: "Beautiful marble Ganesha statue for spiritual and decorative purposes",
//                         longDescription: "This exquisite marble statue of Lord Ganesha is meticulously hand-carved by skilled artisans. Made from premium quality marble, it features intricate detailing and a beautiful finish. Perfect for home decor, office spaces, or as a spiritual centerpiece. The statue brings positive energy and prosperity to any space.",
//                         description: "Premium quality marble statue of Lord Ganesha for home and office decor"
//                     };
//                 }
                
//                 // Ensure all media fields exist
//                 productData = {
//                     ...productData,
//                     thumbnail: productData.thumbnail || fallbackImages[0],
//                     images: Array.isArray(productData.images) ? productData.images : 
//                            productData.image ? [productData.image] : fallbackImages,
//                     video360: productData.video360 || sampleVideos[0]
//                 };
                
//                 console.log('✅ Final Product Data with Video:', productData);
//                 setProduct(productData);
                
//             } catch (error) {
//                 console.error('❌ Error in fetchProduct:', error);
                
//                 // Ultimate fallback with video
//                 const ultimateFallback = {
//                     _id: id || "1",
//                     name: "Marble Ganesha Statue",
//                     price: 2500,
//                     moq: 25,
//                     thumbnail: fallbackImages[0],
//                     images: fallbackImages,
//                     video360: sampleVideos[0],
//                     category: { name: "Statues" },
//                     subCategory: { name: "Ganesha" },
//                     features: ["Premium Quality", "Handmade"],
//                     services: ["Custom"]
//                 };
                
//                 setProduct(ultimateFallback);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchProduct();
//         } else {
//             console.log('❌ No ID in URL');
//             router.push("/category");
//         }
//     }, [id, router]);

//     // Extract media from product - VIDEO FIRST
//     const extractMedia = () => {
//         if (!product) return { mediaItems: [], videoUrl: null };
        
//         let mediaItems = [];
//         const thumbnail = product.thumbnail || fallbackImages[0];
        
//         // ✅ VIDEO FIRST in the media list
//         if (product.video360) {
//             mediaItems.push({ 
//                 type: 'video', 
//                 url: product.video360, 
//                 thumbnail: thumbnail,
//                 title: '360° Product View'
//             });
//         }
        
//         // Add thumbnail as first image
//         mediaItems.push({ 
//             type: 'image', 
//             url: thumbnail,
//             isThumbnail: true
//         });
        
//         // Add other images
//         if (product.images && Array.isArray(product.images)) {
//             product.images.forEach((image, index) => {
//                 if (image && image !== thumbnail) {
//                     mediaItems.push({ 
//                         type: 'image', 
//                         url: image,
//                         index: index
//                     });
//                 }
//             });
//         }
        
//         // Ensure at least one item
//         if (mediaItems.length === 0) {
//             mediaItems.push({ type: 'image', url: fallbackImages[0] });
//         }
        
//         return { 
//             mediaItems, 
//             videoUrl: product.video360,
//             thumbnail 
//         };
//     };

//     const { mediaItems, videoUrl, thumbnail } = extractMedia();
//     const currentMedia = mediaItems[currentMediaIndex];

//     // Video control functions
//     const togglePlayPause = () => {
//         if (videoRef.current) {
//             if (isPlaying) {
//                 videoRef.current.pause();
//             } else {
//                 videoRef.current.play().catch(err => {
//                     console.error('Video play error:', err);
//                 });
//             }
//             setIsPlaying(!isPlaying);
//         }
//     };

//     const toggleMute = () => {
//         if (videoRef.current) {
//             videoRef.current.muted = !videoRef.current.muted;
//             setIsMuted(videoRef.current.muted);
//             if (!videoRef.current.muted) {
//                 videoRef.current.volume = volume;
//             }
//         }
//     };

//     const handleVolumeChange = (e) => {
//         const newVolume = parseFloat(e.target.value);
//         setVolume(newVolume);
//         if (videoRef.current) {
//             videoRef.current.volume = newVolume;
//             videoRef.current.muted = newVolume === 0;
//             setIsMuted(newVolume === 0);
//         }
//     };

//     const handleTimeUpdate = () => {
//         if (videoRef.current) {
//             setCurrentTime(videoRef.current.currentTime);
//             setDuration(videoRef.current.duration || 0);
//         }
//     };

//     const handleProgressClick = (e) => {
//         if (videoRef.current && duration > 0) {
//             const progressBar = e.currentTarget;
//             const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
//             const progressBarWidth = progressBar.clientWidth;
//             const percentage = clickPosition / progressBarWidth;
//             const newTime = percentage * duration;
//             videoRef.current.currentTime = newTime;
//             setCurrentTime(newTime);
//         }
//     };

//     const formatTime = (time) => {
//         const minutes = Math.floor(time / 60);
//         const seconds = Math.floor(time % 60);
//         return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//     };

//     const toggleFullscreen = () => {
//         if (!document.fullscreenElement) {
//             videoContainerRef.current?.requestFullscreen();
//             setIsFullscreen(true);
//         } else {
//             document.exitFullscreen();
//             setIsFullscreen(false);
//         }
//     };

//     useEffect(() => {
//         const handleFullscreenChange = () => {
//             setIsFullscreen(!!document.fullscreenElement);
//         };

//         document.addEventListener('fullscreenchange', handleFullscreenChange);
//         return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     }, []);

//     const nextSlide = () => {
//         if (mediaItems.length) {
//             setCurrentMediaIndex((prev) => {
//                 const nextIndex = (prev + 1) % mediaItems.length;
//                 if (mediaItems[prev]?.type === 'video' && videoRef.current) {
//                     videoRef.current.pause();
//                     setIsPlaying(false);
//                 }
//                 return nextIndex;
//             });
//         }
//     };
    
//     const prevSlide = () => {
//         if (mediaItems.length) {
//             setCurrentMediaIndex((prev) => {
//                 const prevIndex = prev === 0 ? mediaItems.length - 1 : prev - 1;
//                 if (mediaItems[prev]?.type === 'video' && videoRef.current) {
//                     videoRef.current.pause();
//                     setIsPlaying(false);
//                 }
//                 return prevIndex;
//             });
//         }
//     };

//     const handleVideoEnded = () => {
//         setIsPlaying(false);
//         // Auto-play next media if video ends
//         setTimeout(() => {
//             nextSlide();
//         }, 1000);
//     };

//     const handleVideoLoaded = () => {
//         if (videoRef.current) {
//             setDuration(videoRef.current.duration);
//             videoRef.current.volume = volume;
//         }
//     };

//     // Handle video error
//     const handleVideoError = (e) => {
//         console.error('Video error:', e);
//         // Try fallback video
//         if (currentMedia.url === sampleVideos[0]) {
//             e.target.src = sampleVideos[1];
//         }
//     };

//     // Transform product data
//     const transformProductData = () => {
//         if (!product) return null;

//         return {
//             id: product._id || "1",
//             name: product.name || "Premium Product",
//             price: product.price?.toString() || "2999",
//             moq: product.minimumOrderQuantity || product.moq || 50,
//             images: mediaItems.filter(item => item.type === 'image').map(item => item.url),
//             video360: videoUrl,
//             godName: product.godName || "Ganesha",
//             color: product.color || "Multicolor",
//             suitableFor: product.suitableFor || "Home & Office",
//             usage: product.usage || "Interior Decor",
//             posture: product.posture || "Sitting",
//             baseShape: product.baseShape || "Round",
//             finish: product.finish || "Hand Painted",
//             appearance: product.appearance || "Glossy",
//             careInstruction: product.careInstruction || "Wipe with dry cloth",
//             assemblyRequired: product.assemblyRequired || "Already Assembled",
//             availability: product.availability || "In Stock",
//             shortDescription: product.shortDescription || "Beautiful decorative statue",
//             longDescription: product.longDescription || product.description || `Enhance your space with our beautiful ${product.name}.`,
//             features: product.features || ["Premium Quality", "Handmade", "Eco-friendly"],
//             category: product.category?.name || "Statues",
//             subCategory: product.subCategory?.name || "Ganesha"
//         };
//     };

//     const transformedProduct = transformProductData();

//     const productSpecs = [
//         { label: "Product Name", value: transformedProduct?.name },
//         { label: "Category", value: transformedProduct?.category },
//         { label: "Sub Category", value: transformedProduct?.subCategory },
//         { label: "Color", value: transformedProduct?.color },
//         { label: "Suitable For", value: transformedProduct?.suitableFor },
//         { label: "Usage/Application", value: transformedProduct?.usage },
//         { label: "Posture", value: transformedProduct?.posture },
//         { label: "Base Shape", value: transformedProduct?.baseShape },
//         { label: "Finish", value: transformedProduct?.finish },
//         { label: "Appearance", value: transformedProduct?.appearance },
//         { label: "Care Instruction", value: transformedProduct?.careInstruction },
//         { label: "Assembly Required", value: transformedProduct?.assemblyRequired },
//         { label: "Availability", value: transformedProduct?.availability },
//     ];

//     if (loading) {
//         return (
//             <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf8e44] mx-auto"></div>
//                     <p className="mt-4 text-gray-600">Loading product details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!product || !transformedProduct) {
//         return (
//             <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-600">Product not found</p>
//                     <button 
//                         onClick={() => router.push("/category")}
//                         className="mt-4 px-6 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#a56e2e] transition-colors"
//                     >
//                         Back to Categories
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full bg-[#fffcf7] min-h-screen font-sans pb-8 md:pb-20">
//             <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 md:pt-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
//                     {/* LEFT COLUMN - Media Gallery */}
//                     <div className="lg:col-span-7 space-y-4 md:space-y-6">
//                         {/* Main Media Display */}
//                         <div 
//                             ref={videoContainerRef}
//                             className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
//                         >
//                             {currentMedia?.type === 'video' ? (
//                                 <div className="relative w-full h-full group">
//                                     <video
//                                         ref={videoRef}
//                                         src={currentMedia.url}
//                                         className="w-full h-full object-contain bg-black"
//                                         onEnded={handleVideoEnded}
//                                         onTimeUpdate={handleTimeUpdate}
//                                         onLoadedData={handleVideoLoaded}
//                                         onError={handleVideoError}
//                                         playsInline
//                                         preload="metadata"
//                                         poster={currentMedia.thumbnail}
//                                         controls={false}
//                                     />
                                    
//                                     {/* Video Controls Overlay */}
//                                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                         {/* Progress Bar */}
//                                         <div 
//                                             className="w-full h-1 md:h-1.5 bg-gray-600 rounded-full mb-3 md:mb-4 cursor-pointer"
//                                             onClick={handleProgressClick}
//                                         >
//                                             <div 
//                                                 className="h-full bg-[#C08237] rounded-full"
//                                                 style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
//                                             />
//                                         </div>
                                        
//                                         {/* Control Buttons */}
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center gap-2 md:gap-4">
//                                                 {/* Play/Pause */}
//                                                 <button
//                                                     onClick={togglePlayPause}
//                                                     className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                                                     aria-label={isPlaying ? "Pause" : "Play"}
//                                                 >
//                                                     {isPlaying ? (
//                                                         <Pause size={18} className="text-white md:w-5 md:h-5" />
//                                                     ) : (
//                                                         <Play size={18} className="text-white md:w-5 md:h-5" />
//                                                     )}
//                                                 </button>
                                                
//                                                 {/* Time Display */}
//                                                 <span className="text-white text-xs md:text-sm font-medium">
//                                                     {formatTime(currentTime)} / {formatTime(duration)}
//                                                 </span>
//                                             </div>
                                            
//                                             <div className="flex items-center gap-2 md:gap-4">
//                                                 {/* Volume Control */}
//                                                 <div className="relative" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
//                                                     <button
//                                                         onClick={toggleMute}
//                                                         className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                                                         aria-label={isMuted ? "Unmute" : "Mute"}
//                                                     >
//                                                         {isMuted || volume === 0 ? (
//                                                             <VolumeX size={18} className="text-white md:w-5 md:h-5" />
//                                                         ) : (
//                                                             <Volume2 size={18} className="text-white md:w-5 md:h-5" />
//                                                         )}
//                                                     </button>
                                                    
//                                                     {showVolumeSlider && (
//                                                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 backdrop-blur-sm rounded-lg z-10">
//                                                             <input
//                                                                 type="range"
//                                                                 min="0"
//                                                                 max="1"
//                                                                 step="0.1"
//                                                                 value={volume}
//                                                                 onChange={handleVolumeChange}
//                                                                 className="w-24 h-1.5 bg-gray-600 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C08237] [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C08237]"
//                                                             />
//                                                         </div>
//                                                     )}
//                                                 </div>
                                                
//                                                 {/* Fullscreen */}
//                                                 <button
//                                                     onClick={toggleFullscreen}
//                                                     className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                                                     aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
//                                                 >
//                                                     <Maximize2 size={18} className="text-white md:w-5 md:h-5" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
                                    
//                                     {/* Video Badge */}
//                                     <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#C08237] text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                                         <Play size={10} className="md:w-3 md:h-3" /> 360° VIEW
//                                     </div>
                                    
//                                     {/* Play Button Overlay when paused */}
//                                     {!isPlaying && (
//                                         <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                                             <button
//                                                 onClick={togglePlayPause}
//                                                 className="w-16 h-16 md:w-20 md:h-20 bg-[#C08237]/90 rounded-full flex items-center justify-center hover:bg-[#C08237] transition-colors"
//                                             >
//                                                 <Play size={32} className="text-white ml-1" />
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                                         <img 
//                                             src={currentMedia?.url} 
//                                             className="w-full h-full object-contain p-4"
//                                             alt={transformedProduct.name}
//                                             onError={(e) => {
//                                                 console.log('Image failed to load:', currentMedia?.url);
//                                                 if (thumbnail && thumbnail !== currentMedia?.url) {
//                                                     e.target.src = thumbnail;
//                                                 } else if (fallbackImages[0]) {
//                                                     e.target.src = fallbackImages[0];
//                                                 }
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-gray-800 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
//                                         IMAGE
//                                     </div>
//                                 </>
//                             )}
                            
//                             {/* Navigation Arrows */}
//                             {mediaItems.length > 1 && (
//                                 <>
//                                     <button 
//                                         onClick={prevSlide} 
//                                         className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
//                                         aria-label="Previous"
//                                     >
//                                         <ChevronLeft size={18} className="text-gray-700 md:w-6 md:h-6" />
//                                     </button>
//                                     <button 
//                                         onClick={nextSlide} 
//                                         className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
//                                         aria-label="Next"
//                                     >
//                                         <ChevronRight size={18} className="text-gray-700 md:w-6 md:h-6" />
//                                     </button>
//                                 </>
//                             )}
//                         </div>

//                         {/* Thumbnails Grid - Responsive */}
//                         <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2 md:gap-3">
//                             {mediaItems.map((media, idx) => (
//                                 <button
//                                     key={idx}
//                                     onClick={() => {
//                                         if (media.type === 'video' && videoRef.current) {
//                                             videoRef.current.pause();
//                                             setIsPlaying(false);
//                                         }
//                                         setCurrentMediaIndex(idx);
//                                     }}
//                                     className={`relative aspect-square rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${currentMediaIndex === idx ? 'border-[#C08237] scale-[1.02] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
//                                     aria-label={`View ${media.type} ${idx + 1}`}
//                                 >
//                                     {media.type === 'video' ? (
//                                         <>
//                                             <img 
//                                                 src={media.thumbnail || thumbnail}
//                                                 alt="Video thumbnail"
//                                                 className="w-full h-full object-cover"
//                                             />
//                                             <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//                                                 <Play size={14} className="text-white md:w-4 md:h-4" />
//                                             </div>
//                                             <div className="absolute top-1 right-1 bg-[#C08237] text-white text-[9px] md:text-[10px] px-1 py-0.5 rounded">
//                                                 VIDEO
//                                             </div>
//                                         </>
//                                     ) : (
//                                         <img 
//                                             src={media.url} 
//                                             alt={`${transformedProduct.name} thumbnail ${idx + 1}`}
//                                             className="w-full h-full object-cover"
//                                             onError={(e) => {
//                                                 e.target.src = fallbackImages[idx % fallbackImages.length];
//                                             }}
//                                         />
//                                     )}
//                                 </button>
//                             ))}
//                         </div>

//                         {/* Media Information Card */}
//                         <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
//                             <div className="flex items-center justify-between mb-3">
//                                 <h3 className="text-base md:text-lg font-semibold text-gray-800">Media Details</h3>
//                                 {videoUrl && (
//                                     <button className="text-xs md:text-sm text-[#C08237] font-medium hover:text-[#a56e2e] transition-colors flex items-center gap-1">
//                                         <Download size={14} className="md:w-4 md:h-4" /> Download Video
//                                     </button>
//                                 )}
//                             </div>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
//                                 <div>
//                                     <span className="text-gray-600">Total Media:</span>
//                                     <span className="ml-2 font-medium">{mediaItems.length} items</span>
//                                 </div>
//                                 <div>
//                                     <span className="text-gray-600">360° View:</span>
//                                     <span className="ml-2 font-medium text-[#C08237]">
//                                         {videoUrl ? 'Available' : 'Not Available'}
//                                     </span>
//                                 </div>
//                                 {videoUrl && (
//                                     <>
//                                         <div className="sm:col-span-2 grid grid-cols-2 gap-2">
//                                             <div className="bg-gray-50 p-2 rounded-lg">
//                                                 <span className="text-gray-600 text-xs">Video Format:</span>
//                                                 <span className="ml-2 font-medium text-sm">MP4</span>
//                                             </div>
//                                             <div className="bg-gray-50 p-2 rounded-lg">
//                                                 <span className="text-gray-600 text-xs">Duration:</span>
//                                                 <span className="ml-2 font-medium text-sm">{formatTime(duration)}</span>
//                                             </div>
//                                         </div>
//                                     </>
//                                 )}
//                                 <div className="sm:col-span-2">
//                                     <p className="text-gray-600 text-sm">
//                                         <span className="font-medium">Tip:</span> Click on thumbnails to switch between images and 360° video view. Use video controls for playback.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* RIGHT COLUMN - Product Details */}
//                     <div className="lg:col-span-5 space-y-4 md:space-y-6">
//                         {/* Product Header */}
//                         <div className="space-y-3">
//                             <div className="flex items-start justify-between">
//                                 <div className="flex-1">
//                                     <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
//                                         {transformedProduct.name}
//                                     </h1>
//                                     <div className="flex items-center gap-2 mt-2">
//                                         <span className="text-xs md:text-sm text-gray-500">Category:</span>
//                                         <span className="text-xs md:text-sm font-medium text-[#C08237]">
//                                             {transformedProduct.category}
//                                             {transformedProduct.subCategory && ` › ${transformedProduct.subCategory}`}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <button 
//                                     className="p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors"
//                                     aria-label="Add to wishlist"
//                                 >
//                                     <Heart size={20} className="text-gray-600 md:w-6 md:h-6" />
//                                 </button>
//                             </div>

//                             {/* Price and MOQ Card */}
//                             <div className="bg-[#F9F5F0] rounded-xl p-4 md:p-6">
//                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//                                     <div>
//                                         <p className="text-xs md:text-sm text-gray-600">Price per piece</p>
//                                         <p className="text-2xl md:text-3xl font-bold text-gray-900">₹ {transformedProduct.price}</p>
//                                     </div>
//                                     <div className="text-left sm:text-right">
//                                         <p className="text-xs md:text-sm text-gray-600">Minimum Order Quantity</p>
//                                         <p className="text-xl md:text-2xl font-bold text-[#C08237]">{transformedProduct.moq} Pieces</p>
//                                     </div>
//                                 </div>
                                
//                                 {/* Quantity Selector (Simplified) */}
//                                 <div className="mb-4">
//                                     <p className="text-sm font-medium text-gray-700 mb-2">Quantity:</p>
//                                     <div className="flex items-center gap-3">
//                                         <div className="flex items-center border border-gray-300 rounded-lg">
//                                             <button 
//                                                 onClick={() => setQuantity(prev => Math.max(transformedProduct.moq, prev - 1))}
//                                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
//                                             >
//                                                 -
//                                             </button>
//                                             <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center font-medium">
//                                                 {quantity}
//                                             </span>
//                                             <button 
//                                                 onClick={() => setQuantity(prev => prev + 1)}
//                                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
//                                             >
//                                                 +
//                                             </button>
//                                         </div>
//                                         <div className="text-sm text-gray-600">
//                                             Total: <span className="font-bold text-[#C08237]">₹ {transformedProduct.price * quantity}</span>
//                                         </div>
//                                     </div>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                         Minimum quantity: {transformedProduct.moq} pieces
//                                     </p>
//                                 </div>
                                
//                                 <button
//                                     onClick={() => setShowInquiryModal(true)}
//                                     className="w-full py-3 bg-[#C08237] text-white font-semibold rounded-lg hover:bg-[#a56e2e] transition-colors text-sm md:text-base flex items-center justify-center gap-2"
//                                 >
//                                     <span>Send Product Inquiry</span>
//                                     <ChevronRight size={18} className="md:w-5 md:h-5" />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Quick Specs Card */}
//                         <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
//                             <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Specifications</h3>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                 {productSpecs.slice(0, 8).map((spec, idx) => (
//                                     <div key={idx} className="space-y-1">
//                                         <p className="text-xs md:text-sm text-gray-500">{spec.label}</p>
//                                         <p className="text-sm md:text-base font-medium text-gray-800 truncate">{spec.value}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                             <button 
//                                 onClick={() => {
//                                     document.getElementById('full-specs')?.scrollIntoView({ behavior: 'smooth' });
//                                 }}
//                                 className="w-full mt-4 py-2 md:py-3 text-[#C08237] font-medium border border-[#C08237] rounded-lg hover:bg-[#C08237] hover:text-white transition-colors text-sm md:text-base"
//                             >
//                                 View All Specifications
//                             </button>
//                         </div>

//                         {/* Product Description Card */}
//                         <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
//                             <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
//                             <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
//                                 {transformedProduct.shortDescription}
//                             </p>
//                             <div className="space-y-2">
//                                 <h4 className="font-medium text-gray-800 text-sm md:text-base">Key Features:</h4>
//                                 <ul className="space-y-2">
//                                     {transformedProduct.features.map((feature, idx) => (
//                                         <li key={idx} className="flex items-start gap-2">
//                                             <div className="w-1.5 h-1.5 bg-[#C08237] rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
//                                             <span className="text-sm text-gray-600">{feature}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         {/* Bulk Order Benefits Card */}
//                         <div className="bg-gradient-to-r from-[#F9F5F0] to-[#FFF4E6] rounded-xl p-4 md:p-5 border border-[#E8D9C3]">
//                             <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Bulk Order Benefits</h3>
//                             <div className="space-y-3">
//                                 {[
//                                     { title: "Wholesale Prices", desc: "Significant cost savings for bulk orders" },
//                                     { title: "Custom Design Support", desc: "Tailored solutions for your business needs" },
//                                     { title: "Private Labeling", desc: "Brand products with your own logo" },
//                                     { title: "Priority Shipping", desc: "Faster delivery for bulk orders" }
//                                 ].map((benefit, idx) => (
//                                     <div key={idx} className="flex items-start gap-3">
//                                         <div className="w-6 h-6 md:w-7 md:h-7 bg-[#C08237] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                                             <span className="text-white font-bold text-xs md:text-sm">✓</span>
//                                         </div>
//                                         <div>
//                                             <p className="font-medium text-gray-800 text-sm md:text-base">{benefit.title}</p>
//                                             <p className="text-xs md:text-sm text-gray-600">{benefit.desc}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Video Info Card */}
//                         {videoUrl && (
//                             <div className="bg-blue-50 rounded-xl p-4 md:p-5 border border-blue-100">
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <div className="w-8 h-8 bg-[#C08237] rounded-full flex items-center justify-center">
//                                         <Play size={16} className="text-white" />
//                                     </div>
//                                     <h3 className="text-base md:text-lg font-semibold text-gray-800">360° View Available</h3>
//                                 </div>
//                                 <p className="text-sm text-gray-600 mb-3">
//                                     Experience this product in 360° view. Rotate, zoom and explore every angle before making a decision.
//                                 </p>
//                                 <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
//                                     <Settings size={14} className="md:w-4 md:h-4" />
//                                     <span>Use mouse/touch to rotate • Scroll to zoom • Click play to start</span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Full Specifications Section */}
//                 <div id="full-specs" className="mt-8 md:mt-12 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
//                     <div className="flex items-center justify-between mb-4 md:mb-6">
//                         <h3 className="text-xl md:text-2xl font-bold text-gray-900">Complete Product Specifications</h3>
//                         <button className="text-xs md:text-sm text-[#C08237] font-medium hover:text-[#a56e2e] transition-colors">
//                             Print Specifications
//                         </button>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//                         {productSpecs.map((spec, idx) => (
//                             <div key={idx} className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                                 <p className="text-xs md:text-sm text-gray-500 font-medium mb-1">{spec.label}</p>
//                                 <p className="text-sm md:text-base font-semibold text-gray-800">{spec.value}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
            
//             {/* Product Inquiry Modal */}
//             {showInquiryModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-xl max-w-md w-full p-6">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-xl font-bold text-gray-900">Product Inquiry</h3>
//                             <button 
//                                 onClick={() => setShowInquiryModal(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-full"
//                             >
//                                 <X size={20} />
//                             </button>
//                         </div>
//                         <div className="space-y-4">
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-1">Product:</p>
//                                 <p className="font-medium">{transformedProduct.name}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-1">Quantity:</p>
//                                 <p className="font-medium">{quantity} pieces</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-1">Total Amount:</p>
//                                 <p className="text-xl font-bold text-[#C08237]">₹ {transformedProduct.price * quantity}</p>
//                             </div>
//                             <button
//                                 onClick={() => {
//                                     setShowInquiryModal(false);
//                                     router.push(`/productInquiry?productId=${transformedProduct.id}&quantity=${quantity}`);
//                                 }}
//                                 className="w-full py-3 bg-[#C08237] text-white font-semibold rounded-lg hover:bg-[#a56e2e] transition-colors"
//                             >
//                                 Proceed to Inquiry Form
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
            
//             <div className='my-6 md:my-8 px-3 sm:px-4 md:px-0'>
//                 <ProductInquiry/>
//             </div>

//             <div className='my-6 md:my-8 px-3 sm:px-4 md:px-0'>
//                 <WhyChooseSection/>
//             </div>
//         </div>
//     );
// };

// export default ProductDetailPage;

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Heart,
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Maximize2,
//   Download,
//   X,
// } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import ProductInquiry from "../../productInquiry/page.jsx";
// import WhyChooseSection from "../../components/WhyChooseSection.jsx";

// const ProductDetailPage = () => {
//   const { id } = useParams();
//   const router = useRouter();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(0.5);
//   const [quantity, setQuantity] = useState(1);
//   const [showInquiryModal, setShowInquiryModal] = useState(false);

//   const videoRef = useRef(null);
//   const videoContainerRef = useRef(null);

//   /* ================= FETCH PRODUCT ================= */
//   useEffect(() => {
//     if (!id) return;

//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/admin/products/${id}`);
//         const data = await res.json();

//         if (!data.success || !data.data) {
//           router.push("/category");
//           return;
//         }

//         setProduct(data.data);
//       } catch (err) {
//         console.error(err);
//         router.push("/category");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id, router]);

//   /* ================= MEDIA EXTRACT ================= */
//   const mediaItems = [];

//   if (product?.video360) {
//     mediaItems.push({
//       type: "video",
//       url: product.video360,
//       thumbnail: product.thumbnail,
//     });
//   }

//   if (product?.thumbnail) {
//     mediaItems.push({
//       type: "image",
//       url: product.thumbnail,
//     });
//   }

//   if (Array.isArray(product?.images)) {
//     product.images.forEach((img) => {
//       if (img && img !== product.thumbnail) {
//         mediaItems.push({ type: "image", url: img });
//       }
//     });
//   }

//   const currentMedia = mediaItems[currentMediaIndex];

//   /* ================= VIDEO CONTROLS ================= */
//   const togglePlayPause = () => {
//     if (!videoRef.current) return;
//     isPlaying ? videoRef.current.pause() : videoRef.current.play();
//     setIsPlaying(!isPlaying);
//   };

//   const toggleMute = () => {
//     if (!videoRef.current) return;
//     videoRef.current.muted = !videoRef.current.muted;
//     setIsMuted(videoRef.current.muted);
//   };

//   const handleTimeUpdate = () => {
//     if (!videoRef.current) return;
//     setCurrentTime(videoRef.current.currentTime);
//     setDuration(videoRef.current.duration || 0);
//   };

//   const handleFullscreen = () => {
//     videoContainerRef.current?.requestFullscreen();
//   };

//   /* ================= TRANSFORM DATA ================= */
//   const transformedProduct = product && {
//     id: product._id,
//     name: product.name,
//     price: product.price,
//     moq: product.moq,
//     category: product.category?.name,
//     subCategory: product.subCategory?.name,
//     features: product.features || [],
//     services: product.services || [],
//     availability: product.availability,
//     godName: product.godName,
//     color: product.color,
//     suitableFor: product.suitableFor,
//     usage: product.usage,
//     posture: product.posture,
//     baseShape: product.baseShape,
//     finish: product.finish,
//     appearance: product.appearance,
//     careInstruction: product.careInstruction,
//     assemblyRequired: product.assemblyRequired,
//     shortDescription: product.shortDescription,
//     longDescription: product.longDescription || product.description,
//   };

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <div className="animate-spin h-10 w-10 border-b-2 border-[#C08237] rounded-full" />
//       </div>
//     );
//   }

//   if (!product) return null;

//   /* ================= UI ================= */
//   return (
//     <div className="bg-[#fffcf7] min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

//         {/* ================= LEFT MEDIA ================= */}
//         <div className="lg:col-span-7">
//           <div
//             ref={videoContainerRef}
//             className="relative bg-white rounded-xl h-[450px] overflow-hidden"
//           >
//             {currentMedia?.type === "video" ? (
//               <>
//                 <video
//                   ref={videoRef}
//                   src={currentMedia.url}
//                   className="w-full h-full object-contain bg-black"
//                   muted={isMuted}
//                   onTimeUpdate={handleTimeUpdate}
//                 />

//                 <div className="absolute bottom-4 left-4 flex gap-3">
//                   <button onClick={togglePlayPause}>
//                     {isPlaying ? <Pause /> : <Play />}
//                   </button>
//                   <button onClick={toggleMute}>
//                     {isMuted ? <VolumeX /> : <Volume2 />}
//                   </button>
//                   <button onClick={handleFullscreen}>
//                     <Maximize2 />
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <img
//                 src={currentMedia?.url}
//                 alt={product.name}
//                 className="w-full h-full object-contain"
//               />
//             )}

//             {mediaItems.length > 1 && (
//               <>
//                 <button
//                   onClick={() =>
//                     setCurrentMediaIndex((p) =>
//                       p === 0 ? mediaItems.length - 1 : p - 1
//                     )
//                   }
//                   className="absolute left-4 top-1/2"
//                 >
//                   <ChevronLeft />
//                 </button>
//                 <button
//                   onClick={() =>
//                     setCurrentMediaIndex((p) => (p + 1) % mediaItems.length)
//                   }
//                   className="absolute right-4 top-1/2"
//                 >
//                   <ChevronRight />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* ================= RIGHT DETAILS ================= */}
//         <div className="lg:col-span-5 space-y-5">
//           <h1 className="text-3xl font-bold">{transformedProduct.name}</h1>

//           <p className="text-gray-600">
//             {transformedProduct.category}
//             {transformedProduct.subCategory && ` › ${transformedProduct.subCategory}`}
//           </p>

//           <div className="bg-[#F9F5F0] p-5 rounded-xl">
//             <p className="text-3xl font-bold">₹ {transformedProduct.price}</p>
//             <p className="text-sm text-gray-600">
//               MOQ: {transformedProduct.moq} pcs
//             </p>
//           </div>

//           <button
//             onClick={() => setShowInquiryModal(true)}
//             className="w-full bg-[#C08237] text-white py-3 rounded-lg"
//           >
//             Send Product Inquiry
//           </button>
//         </div>
//       </div>

//       {/* ================= MODAL ================= */}
//       {showInquiryModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl max-w-md w-full">
//             <h3 className="text-xl font-bold mb-3">Product Inquiry</h3>
//             <p>{product.name}</p>
//             <button
//               onClick={() => setShowInquiryModal(false)}
//               className="mt-4 w-full bg-[#C08237] text-white py-2 rounded"
//             >
//               Proceed
//             </button>
//           </div>
//         </div>
//       )}

//       <ProductInquiry />
//       <WhyChooseSection />
//     </div>
//   );
// };

// export default ProductDetailPage;


"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, Settings, Download, X } from 'lucide-react';
import ProductInquiry from '../../productInquiry/page.jsx';
import WhyChooseSection from '../../components/WhyChooseSection.jsx';
import { useParams, useRouter } from "next/navigation";

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

    // Fallback images
    const fallbackImages = [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
    ];

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

    /* ================= FIXED: EXTRACT MEDIA ================= */
    const extractMedia = () => {
        if (!product) return { mediaItems: [], videoUrl: null };
        
        let mediaItems = [];
        const thumbnail = product.thumbnail || fallbackImages[0];
        
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
        
        // ✅ VIDEO ADDED AT THE END (not first) to maintain your UI flow
        if (product.video360) {
            mediaItems.push({ 
                type: 'video', 
                url: product.video360, 
                thumbnail: thumbnail,
                title: '360° Product View'
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
                                    className="p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Add to wishlist"
                                >
                                    <Heart size={20} className="text-gray-600 md:w-6 md:h-6" />
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
                                    onClick={() => setShowInquiryModal(true)}
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