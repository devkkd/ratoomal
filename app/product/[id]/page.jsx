// "use client";
// import React, { useState, useEffect } from 'react';
// import { Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
// import ProductInquiry from '../productInquiry/page.jsx';
// import WhyChooseSection from '../components/WhyChooseSection.jsx';

// const ProductDetailPage = () => {
//   const images = [
//     "/images/products/image 59.png",
//     "/images/products/image 62.svg",
//     "/images/products/image 63.svg",
//     "/images/products/image 64.svg",
//     "/images/products/image 65.svg",
//     "/images/products/image 67.png",
//     "/images/products/image 68.png",
//   ];

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

//   const nextSlide = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   const prevSlide = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

//   const productSpecs = [
//     { label: "God Name", value: "Ganesh Statue" },
//     { label: "Color", value: "Multicolor" },
//     { label: "Suitable For", value: "Home" },
//     { label: "Usage/Application", value: "Interior Decor" },
//     { label: "Posture", value: "Posture Sitting" },
//     { label: "Base Shape", value: "Rectangular" },
//     { label: "Finish", value: "Color Coated" },
//     { label: "Appearance", value: "Glossy" },
//     { label: "Care Instruction", value: "Wipe With A Dry Cloth" },
//     { label: "Assembly Required", value: "Already Assembled" },
//     { label: "Availability", value: "In Stock" },
//   ];

//   return (
//     <div className="w-full bg-[#fffcf7] min-h-screen font-sans pb-8 md:pb-20 relative">
      
//       {/* 2. Main Triple Image Slider Section */}
//       <div className="relative w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[500px] mb-4 md:mb-6">
//         <div className="flex h-full w-full">
//           {isMobile ? (
//             // Mobile: Single image
//             <div className="w-full h-full overflow-hidden">
//               <img 
//                 src={images[currentImageIndex]} 
//                 className="w-full h-full object-cover" 
//                 alt="" 
//               />
//             </div>
//           ) : (
//             // Desktop: Triple image
//             <>
//               <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
//                 <img src={images[currentImageIndex]} className="w-full h-full object-cover" alt="" />
//               </div>
//               <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
//                 <img src={images[(currentImageIndex + 1) % images.length]} className="w-full h-full object-cover" alt="" />
//               </div>
//               <div className="w-1/3 h-full overflow-hidden">
//                 <img src={images[(currentImageIndex + 2) % images.length]} className="w-full h-full object-cover" alt="" />
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

//       {/* 3. Thumbnails Section */}
//       <div className="flex overflow-x-auto justify-start md:justify-center gap-1.5 md:gap-2 mb-6 md:mb-10 px-3 md:px-4 py-2 scrollbar-hide">
//         {images.map((img, idx) => (
//           <div 
//             key={idx} 
//             onClick={() => setCurrentImageIndex(idx)}
//             className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 border-2 cursor-pointer transition-all ${currentImageIndex === idx ? 'border-[#bf8e44]' : 'border-gray-200'}`}
//           >
//             <img src={img} alt="" className="w-full h-full object-cover" />
//           </div>
//         ))}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
//         {/* 4. Product Title & Action Row */}
//         <div className="flex flex-col justify-between items-start mb-6 md:mb-8 gap-3 md:gap-4">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-2 md:gap-0">
//             <p className="text-[#0E0E0E] text-xs sm:text-[10px] md:text-[14px] font-medium tracking-wide mona order-2 sm:order-1 sm:w-auto w-full text-center sm:text-left">
//               Ratoomal's Heritage Collection
//             </p>
//             <h1 className="text-lg sm:text-2xl md:text-3xl text-center sm:text-left w-full sm:w-1/2 mx-auto mona font-bold text-[#1a1a1a] order-1 sm:order-2">
//               Lord Ganesha Sitting Statue
//             </h1>
//           </div>
//         </div>

//         {/* Price and Buttons Row */}
//         <div className="flex flex-col border justify-between items-start md:items-center mb-8 md:mb-10 border-b border-gray-200 pb-6 md:pb-10 gap-4">
//           <div className="text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between w-full font-medium gap-2 sm:gap-0">
//             <div className="w-full sm:w-auto">
//               <span className="text-gray-500 mona font-normal">Minimum Order Quantity:</span> 
//               <span className="text-black mona font-bold ml-1">100 Piece</span>
//             </div>
//             <div className="text-base mona sm:text-md md:text-lg w-full sm:w-1/2 text-center sm:text-center font-black text-[#1a1a1a]">
//               ₹ 5,000/Piece
//             </div>
//             <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-8 w-full sm:w-auto justify-center sm:justify-start">
//             <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
//               <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-full bg-white text-xs font-semibold hover:bg-gray-50 transition flex-shrink-0">
//                 <Heart size={isMobile ? 16 : 18} className="text-gray-600" /> 
//                 <span className="hidden sm:inline">Saved</span>
//               </button>
//               <button className="px-4 sm:px-6 mona py-2.5 sm:py-3 bg-[#C08237] text-white rounded-full font-semibold text-xs hover:bg-[#a67a38] transition shadow-md whitespace-nowrap">
//                 Send Product Inquiry →
//               </button>
//             </div>
//           </div>
//           </div>
          
          
//         </div>

//         {/* 5. Specs and Description Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
          
//           {/* Specifications (Left Side) */}
//           <div className="lg:col-span-4">
//             <h3 className="text-sm md:text-lg mona font-bold mb-2 md:mb-3 text-[#111]">Product Specifications</h3>
//             <div className="border border-[#eee] rounded-sm bg-white overflow-hidden">
//               {productSpecs.map((spec, index) => (
//                 <div key={index} className="flex  flex-col sm:flex-row border-b border-[#D7CEC2] last:border-b-0 text-xs sm:text-[13px]">
//                   <div className="w-full sm:w-1/2  px-3 py-2 font-medium text-[#0E0E0E] sm:border-r border-[#D7CEC2] mona bg-[#fafafa]">
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
//               <h3 className="text-sm md:text-lg mona font-bold  mb-4 md:mb-6 text-[#111]">Product Description</h3>
//               <div className="space-y-1">
//                 <h4 className="text-xs md:text-[14px] mona font-bold text-[#111] leading-snug">
//                   Bulk Purchase Ganesha Idols Online | Wholesale Ganesh Idols for Home & Gifts
//                 </h4>
                
//                 <p className="text-xs mona md:text-[13px] text-gray-700 leading-relaxed font-medium md:leading-[1.8]">
//                  Enhance your living space and gift-giving experience with our stunning collection of Ganesha idols, perfect for home decor, gifting, and more. Discover the best Ganesh idols online, available in various sizes and styles to meet your specific needs.
//                 </p>
//               </div>
//               <hr className='my-3 md:my-4 text-[#D7CEC2]'/>
//               <div className="mt-2 md:mt-3 space-y-2 md:space-y-3">
//                 <h4 className="text-sm md:text-lg mona font-bold text-[#111]">Key Features:</h4>
//                 <div className="space-y-1.5 text-xs md:text-[14px] mona">
//                   <p><span className="font-bold text-gray-800 mona">Ganesha Idols for Home:</span> Explore our selection of Ganesh idols designed for home use. Perfect for placing at your home entrance to bring prosperity and peace.</p>
//                   <p><span className="font-bold text-gray-800 mona">Gift-Worthy Ganesh Idols:</span> Delight your loved ones with beautifully crafted Ganesha idols, ideal for any occasion. Perfect as a thoughtful gift.</p>
//                   <p className="text-gray-800 mona">Variety of Sizes: From 2 feet Ganesh murtis to larger sizes, find the perfect fit for your space.</p>
//                   <p><span className="font-bold text-gray-800 mona">Eco-Friendly Ganesha Idols:</span> Choose from our eco-friendly Ganesha idols made from sustainable materials.</p>
//                   <p><span className="font-bold text-gray-800 mona">Artisan Craftsmanship:</span> Each idol is intricately crafted by skilled artisans, ensuring top-notch quality and detail.</p>
//                 </div>
//               </div>
//                <hr className='my-4 md:my-6 text-[#D7CEC2]'/>
//             </div>

//             {/* Bulk Ordering Benefits */}
//             <div className="space-y-3 md:space-y-4">
//               <h4 className=" mona text-[#111] md:text-md text-sm md:text-lg mona font-bold">Bulk Ordering Benefits:</h4>
//               <div className="space-y-1.5">
//                 <p className="text-xs md:text-[14px] mona">
//                   <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Wholesale Prices:</span> Enjoy significant cost savings with our bulk purchasing options. Ideal for businesses, religious events, and community celebrations.
//                 </p>
//                 <p className="text-xs md:text-[14px] mona">
//                   <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Online Wholesale Market:</span> Conveniently browse and order Ganesha idols online. Our wholesale market offers competitive prices and a seamless shopping experience.
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

// // app/product/[id]/page.jsx
// "use client";
// import React, { useState, useEffect } from 'react';
// import { Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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

// useEffect(() => {
//   const fetchProduct = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch("/data/products.json");
//       const data = await response.json();

//       let productsArray = [];

//       if (Array.isArray(data)) {
//         productsArray = data;
//       } else if (data?.products && Array.isArray(data.products)) {
//         productsArray = data.products;
//       }

//       const foundProduct = productsArray.find(
//         (p) => p.id === Number(id)
//       );

//       if (!foundProduct) {
//         router.push("/category");
//         return;
//       }

//       setProduct(foundProduct);
//     } catch (error) {
//       console.error(error);
//       router.push("/category");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (id) fetchProduct();
// }, [id, router]);


//   const nextSlide = () => setCurrentImageIndex((prev) => (prev + 1) % (product?.images?.length || 1));
//   const prevSlide = () => setCurrentImageIndex((prev) => (prev === 0 ? (product?.images?.length || 1) - 1 : prev - 1));

//   // Fallback images agar product ke images na ho
//   const defaultImages = [
//     "/images/products/image 59.png",
//     "/images/products/image 62.svg",
//     "/images/products/image 63.svg",
//     "/images/products/image 64.svg",
//     "/images/products/image 65.svg",
//     "/images/products/image 67.png",
//     "/images/products/image 68.png",
//   ];

//   const images = product?.images || defaultImages;

//   const productSpecs = [
//     { label: "God Name", value: product?.godName || "Ganesh Statue" },
//     { label: "Color", value: product?.color || "Multicolor" },
//     { label: "Suitable For", value: product?.suitableFor || "Home" },
//     { label: "Usage/Application", value: product?.usage || "Interior Decor" },
//     { label: "Posture", value: product?.posture || "Posture Sitting" },
//     { label: "Base Shape", value: product?.baseShape || "Rectangular" },
//     { label: "Finish", value: product?.finish || "Color Coated" },
//     { label: "Appearance", value: product?.appearance || "Glossy" },
//     { label: "Care Instruction", value: product?.careInstruction || "Wipe With A Dry Cloth" },
//     { label: "Assembly Required", value: product?.assemblyRequired || "Already Assembled" },
//     { label: "Availability", value: product?.availability || "In Stock" },
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

//   if (!product) {
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
//                 alt={product.name} 
//               />
//             </div>
//           ) : (
//             <>
//               <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
//                 <img src={images[currentImageIndex]} className="w-full h-full object-cover" alt={product.name} />
//               </div>
//               <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
//                 <img src={images[(currentImageIndex + 1) % images.length]} className="w-full h-full object-cover" alt={product.name} />
//               </div>
//               <div className="w-1/3 h-full overflow-hidden">
//                 <img src={images[(currentImageIndex + 2) % images.length]} className="w-full h-full object-cover" alt={product.name} />
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
//             <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
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
//             <h1 className="text-lg sm:text-2xl md:text-3xl text-center sm:text-left w-full sm:w-1/2 mx-auto mona font-bold text-[#1a1a1a] order-1 sm:order-2">
//               {product.name}
//             </h1>
//           </div>
//         </div>

//         {/* Price and Buttons Row */}
//         <div className="flex flex-col border justify-between items-start md:items-center mb-8 md:mb-10 border-b border-gray-200 pb-6 md:pb-10 gap-4">
//           <div className="text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between w-full font-medium gap-2 sm:gap-0">
//             <div className="w-full sm:w-auto">
//               <span className="text-gray-500 mona font-normal">Minimum Order Quantity:</span> 
//               <span className="text-black mona font-bold ml-1">{product.moq} Piece</span>
//             </div>
//             <div className="text-base mona sm:text-md md:text-lg w-full sm:w-1/2 text-center sm:text-center font-black text-[#1a1a1a]">
//               ₹ {product.price}/Piece
//             </div>
//             <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-8 w-full sm:w-auto justify-center sm:justify-start">
//             <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
//               <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-full bg-white text-xs font-semibold hover:bg-gray-50 transition flex-shrink-0">
//                 <Heart size={isMobile ? 16 : 18} className="text-gray-600" /> 
//                 <span className="hidden sm:inline">Saved</span>
//               </button>
//               <button className="px-4 sm:px-6 mona py-2.5 sm:py-3 bg-[#C08237] text-white rounded-full font-semibold text-xs hover:bg-[#a67a38] transition shadow-md whitespace-nowrap">
//                 Send Product Inquiry →
//               </button>
//             </div>
//           </div>
//           </div>
//         </div>

//         {/* Specs and Description Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
          
//           {/* Specifications (Left Side) */}
//           <div className="lg:col-span-4">
//             <h3 className="text-sm md:text-lg mona font-bold mb-2 md:mb-3 text-[#111]">Product Specifications</h3>
//             <div className="border border-[#eee] rounded-sm bg-white overflow-hidden">
//               {productSpecs.map((spec, index) => (
//                 <div key={index} className="flex  flex-col sm:flex-row border-b border-[#D7CEC2] last:border-b-0 text-xs sm:text-[13px]">
//                   <div className="w-full sm:w-1/2  px-3 py-2 font-medium text-[#0E0E0E] sm:border-r border-[#D7CEC2] mona bg-[#fafafa]">
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
//               <h3 className="text-sm md:text-lg mona font-bold  mb-4 md:mb-6 text-[#111]">Product Description</h3>
//               <div className="space-y-1">
//                 <h4 className="text-xs md:text-[14px] mona font-bold text-[#111] leading-snug">
//                   {product.shortDescription || "Bulk Purchase Ganesha Idols Online | Wholesale Ganesh Idols for Home & Gifts"}
//                 </h4>
                
//                 <p className="text-xs mona md:text-[13px] text-gray-700 leading-relaxed font-medium md:leading-[1.8]">
//                   {product.longDescription || "Enhance your living space and gift-giving experience with our stunning collection of Ganesha idols, perfect for home decor, gifting, and more. Discover the best Ganesh idols online, available in various sizes and styles to meet your specific needs."}
//                 </p>
//               </div>
//               <hr className='my-3 md:my-4 text-[#D7CEC2]'/>
//               <div className="mt-2 md:mt-3 space-y-2 md:space-y-3">
//                 <h4 className="text-sm md:text-lg mona font-bold text-[#111]">Key Features:</h4>
//                 <div className="space-y-1.5 text-xs md:text-[14px] mona">
//                   {product.features ? (
//                     product.features.map((feature, index) => (
//                       <p key={index}>{feature}</p>
//                     ))
//                   ) : (
//                     <>
//                       <p><span className="font-bold text-gray-800 mona">Ganesha Idols for Home:</span> Explore our selection of Ganesh idols designed for home use. Perfect for placing at your home entrance to bring prosperity and peace.</p>
//                       <p><span className="font-bold text-gray-800 mona">Gift-Worthy Ganesh Idols:</span> Delight your loved ones with beautifully crafted Ganesha idols, ideal for any occasion. Perfect as a thoughtful gift.</p>
//                       <p className="text-gray-800 mona">Variety of Sizes: From 2 feet Ganesh murtis to larger sizes, find the perfect fit for your space.</p>
//                       <p><span className="font-bold text-gray-800 mona">Eco-Friendly Ganesha Idols:</span> Choose from our eco-friendly Ganesha idols made from sustainable materials.</p>
//                       <p><span className="font-bold text-gray-800 mona">Artisan Craftsmanship:</span> Each idol is intricately crafted by skilled artisans, ensuring top-notch quality and detail.</p>
//                     </>
//                   )}
//                 </div>
//               </div>
//                <hr className='my-4 md:my-6 text-[#D7CEC2]'/>
//             </div>

//             {/* Bulk Ordering Benefits */}
//             <div className="space-y-3 md:space-y-4">
//               <h4 className=" mona text-[#111] md:text-md text-sm md:text-lg mona font-bold">Bulk Ordering Benefits:</h4>
//               <div className="space-y-1.5">
//                 <p className="text-xs md:text-[14px] mona">
//                   <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Wholesale Prices:</span> Enjoy significant cost savings with our bulk purchasing options. Ideal for businesses, religious events, and community celebrations.
//                 </p>
//                 <p className="text-xs md:text-[14px] mona">
//                   <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Online Wholesale Market:</span> Conveniently browse and order Ganesha idols online. Our wholesale market offers competitive prices and a seamless shopping experience.
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

// // app/product/[id]/page.jsx
// "use client";
// import React, { useState, useEffect } from 'react';
// import { Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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

//   const nextSlide = () => {
//     if (product?.images?.length) {
//       setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
//     }
//   };
  
//   const prevSlide = () => {
//     if (product?.images?.length) {
//       setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
//     }
//   };

//   // Fallback images agar product ke images na ho
//   const defaultImages = [
//     "/images/products/image 59.png",
//     "/images/products/image 62.svg",
//     "/images/products/image 63.svg",
//     "/images/products/image 64.svg",
//     "/images/products/image 65.svg",
//     "/images/products/image 67.png",
//     "/images/products/image 68.png",
//   ];

//   const images = product?.images?.length > 0 ? product.images : defaultImages;

//   // Transform backend data to match frontend structure
//   const transformProductData = () => {
//     if (!product) return null;

//     return {
//       id: product._id,
//       name: product.name || "Unnamed Product",
//       price: product.price?.toString() || "0",
//       moq: product.minimumOrderQuantity || product.moq || 0,
//       images: images,
//       godName: product.godName || product.name || "Ganesh Statue",
//       color: product.color || "Multicolor",
//       suitableFor: product.suitableFor || "Home",
//       usage: product.usage || "Interior Decor",
//       posture: product.posture || "Sitting",
//       baseShape: product.baseShape || "Rectangular",
//       finish: product.finish || "Color Coated",
//       appearance: product.appearance || "Glossy",
//       careInstruction: product.careInstruction || "Wipe With A Dry Cloth",
//       assemblyRequired: product.assemblyRequired || "Already Assembled",
//       availability: product.availability || "In Stock",
//       shortDescription: product.shortDescription || "Bulk Purchase Ganesha Idols Online | Wholesale Gansh Idols for Home & Gifts",
//       longDescription: product.longDescription || "Enhance your living space and gift-giving experience with our stunning collection of Ganesha idols, perfect for home decor, gifting, and more. Discover the best Ganesh idols online, available in various sizes and styles to meet your specific needs.",
//       features: product.features || [
//         "Ganesha Idols for Home: Explore our selection of Ganesh idols designed for home use. Perfect for placing at your home entrance to bring prosperity and peace.",
//         "Gift-Worthy Ganesh Idols: Delight your loved ones with beautifully crafted Ganesha idols, ideal for any occasion. Perfect as a thoughtful gift.",
//         "Variety of Sizes: From 2 feet Ganesh murtis to larger sizes, find the perfect fit for your space.",
//         "Eco-Friendly Ganesha Idols: Choose from our eco-friendly Ganesha idols made from sustainable materials.",
//         "Artisan Craftsmanship: Each idol is intricately crafted by skilled artisans, ensuring top-notch quality and detail."
//       ]
//     };
//   };

//   const transformedProduct = transformProductData();

//   const productSpecs = [
//     { label: "God Name", value: transformedProduct?.godName || "Ganesh Statue" },
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
//               />
//             </div>
//           ) : (
//             <>
//               <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
//                 <img src={images[currentImageIndex]} className="w-full h-full object-cover" alt={transformedProduct.name} />
//               </div>
//               <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
//                 <img src={images[(currentImageIndex + 1) % images.length]} className="w-full h-full object-cover" alt={transformedProduct.name} />
//               </div>
//               <div className="w-1/3 h-full overflow-hidden">
//                 <img src={images[(currentImageIndex + 2) % images.length]} className="w-full h-full object-cover" alt={transformedProduct.name} />
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
//             <img src={img} alt={`${transformedProduct.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
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
//             <h1 className="text-lg sm:text-2xl md:text-3xl text-center sm:text-left w-full sm:w-1/2 mx-auto mona font-bold text-[#1a1a1a] order-1 sm:order-2">
//               {transformedProduct.name}
//             </h1>
//           </div>
//         </div>

//         {/* Price and Buttons Row */}
//         <div className="flex flex-col border justify-between items-start md:items-center mb-8 md:mb-10 border-b border-gray-200 pb-6 md:pb-10 gap-4">
//           <div className="text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between w-full font-medium gap-2 sm:gap-0">
//             <div className="w-full sm:w-auto">
//               <span className="text-gray-500 mona font-normal">Minimum Order Quantity:</span> 
//               <span className="text-black mona font-bold ml-1">{transformedProduct.moq} Piece</span>
//             </div>
//             <div className="text-base mona sm:text-md md:text-lg w-full sm:w-1/2 text-center sm:text-center font-black text-[#1a1a1a]">
//               ₹ {transformedProduct.price}/Piece
//             </div>
//             <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-8 w-full sm:w-auto justify-center sm:justify-start">
//             <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
//               <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-full bg-white text-xs font-semibold hover:bg-gray-50 transition flex-shrink-0">
//                 <Heart size={isMobile ? 16 : 18} className="text-gray-600" /> 
//                 <span className="hidden sm:inline">Saved</span>
//               </button>
//               <button className="px-4 sm:px-6 mona py-2.5 sm:py-3 bg-[#C08237] text-white rounded-full font-semibold text-xs hover:bg-[#a67a38] transition shadow-md whitespace-nowrap">
//                 Send Product Inquiry →
//               </button>
//             </div>
//           </div>
//           </div>
//         </div>

//         {/* Specs and Description Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
          
//           {/* Specifications (Left Side) */}
//           <div className="lg:col-span-4">
//             <h3 className="text-sm md:text-lg mona font-bold mb-2 md:mb-3 text-[#111]">Product Specifications</h3>
//             <div className="border border-[#eee] rounded-sm bg-white overflow-hidden">
//               {productSpecs.map((spec, index) => (
//                 <div key={index} className="flex  flex-col sm:flex-row border-b border-[#D7CEC2] last:border-b-0 text-xs sm:text-[13px]">
//                   <div className="w-full sm:w-1/2  px-3 py-2 font-medium text-[#0E0E0E] sm:border-r border-[#D7CEC2] mona bg-[#fafafa]">
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
//               <h3 className="text-sm md:text-lg mona font-bold  mb-4 md:mb-6 text-[#111]">Product Description</h3>
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
//               <h4 className=" mona text-[#111] md:text-md text-sm md:text-lg mona font-bold">Bulk Ordering Benefits:</h4>
//               <div className="space-y-1.5">
//                 <p className="text-xs md:text-[14px] mona">
//                   <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Wholesale Prices:</span> Enjoy significant cost savings with our bulk purchasing options. Ideal for businesses, religious events, and community celebrations.
//                 </p>
//                 <p className="text-xs md:text-[14px] mona">
//                   <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Online Wholesale Market:</span> Conveniently browse and order Ganesha idols online. Our wholesale market offers competitive prices and a seamless shopping experience.
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

// app/product/[id]/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductInquiry from '../../productInquiry/page.jsx';
import WhyChooseSection from '../../components/WhyChooseSection.jsx';
import { useParams, useRouter } from "next/navigation";

const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);

        // Backend API se product fetch karein
        const response = await fetch(`/api/admin/products`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.success && data.data) {
          // Product ko ID se find karein
          const foundProduct = data.data.find(p => p._id === id);
          
          if (!foundProduct) {
            console.error('Product not found with ID:', id);
            router.push("/category");
            return;
          }

          console.log('Found product:', foundProduct);
          setProduct(foundProduct);
        } else {
          console.error('API response not successful:', data);
          router.push("/category");
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push("/category");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  // Fallback images agar product ke images na ho
  const fallbackImages = [
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1566933293061-be10b4b1b06a?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop"
  ];

  // Extract images from product data
  const extractImages = () => {
    if (!product) return fallbackImages;
    
    let productImages = [];
    
    // Check if product has images array
    if (product.images && Array.isArray(product.images)) {
      // Process each image in the array
      product.images.forEach(image => {
        if (typeof image === 'string') {
          // Direct URL string
          if (image.startsWith('http') || image.startsWith('/')) {
            productImages.push(image);
          }
        } else if (image && image.url) {
          // Object with url property
          productImages.push(image.url);
        } else if (image && typeof image === 'object') {
          // Try to find any URL property
          const values = Object.values(image);
          const urlValue = values.find(val => 
            typeof val === 'string' && (val.startsWith('http') || val.startsWith('/'))
          );
          if (urlValue) {
            productImages.push(urlValue);
          }
        }
      });
    }
    
    // Also check for single image field
    if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
      productImages.push(product.image);
    }
    
    // If still no images, use fallback
    if (productImages.length === 0) {
      console.log('No valid images found, using fallback images');
      return fallbackImages;
    }
    
    console.log('Extracted images:', productImages);
    return productImages;
  };

  const images = extractImages();

  const nextSlide = () => {
    if (images.length) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };
  
  const prevSlide = () => {
    if (images.length) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  // Transform backend data to match frontend structure
  const transformProductData = () => {
    if (!product) return null;

    // Get product category and subcategory names
    const categoryName = product.category ? 
      (typeof product.category === 'string' ? product.category : product.category.name) : 
      "Uncategorized";
    
    const subCategoryName = product.subCategory ? 
      (typeof product.subCategory === 'string' ? product.subCategory : product.subCategory.name) : 
      "";

    return {
      id: product._id,
      name: product.name || "Unnamed Product",
      price: product.price?.toString() || "0",
      moq: product.minimumOrderQuantity || product.moq || 0,
      images: images,
      godName: product.godName || product.name || "Statue",
      color: product.color || "Multicolor",
      suitableFor: product.suitableFor || "Home",
      usage: product.usage || product.categoryName || "Interior Decor",
      posture: product.posture || "Sitting",
      baseShape: product.baseShape || "Rectangular",
      finish: product.finish || "Color Coated",
      appearance: product.appearance || "Glossy",
      careInstruction: product.careInstruction || "Wipe With A Dry Cloth",
      assemblyRequired: product.assemblyRequired || "Already Assembled",
      availability: product.availability || "In Stock",
      shortDescription: product.shortDescription || `${product.name} - Premium Quality Product`,
      longDescription: product.longDescription || product.description || `Enhance your space with our beautiful ${product.name}. Made with premium materials and expert craftsmanship, this product is perfect for home decor, gifting, and more.`,
      features: product.features || [
        `Premium Quality ${product.name}: Crafted with attention to detail and high-quality materials.`,
        "Versatile Use: Perfect for home decor, office decoration, or as a thoughtful gift.",
        "Expert Craftsmanship: Made by skilled artisans ensuring durability and beauty.",
        "Eco-Friendly Materials: Made from sustainable and environmentally friendly materials.",
        "Easy Maintenance: Simple to clean and maintain for long-lasting beauty."
      ],
      category: categoryName,
      subCategory: subCategoryName
    };
  };

  const transformedProduct = transformProductData();

  const productSpecs = [
    { label: "Product Name", value: transformedProduct?.name || "Product" },
    { label: "Category", value: transformedProduct?.category || "Uncategorized" },
    { label: "Sub Category", value: transformedProduct?.subCategory || "Not specified" },
    { label: "Color", value: transformedProduct?.color || "Multicolor" },
    { label: "Suitable For", value: transformedProduct?.suitableFor || "Home" },
    { label: "Usage/Application", value: transformedProduct?.usage || "Interior Decor" },
    { label: "Posture", value: transformedProduct?.posture || "Sitting" },
    { label: "Base Shape", value: transformedProduct?.baseShape || "Rectangular" },
    { label: "Finish", value: transformedProduct?.finish || "Color Coated" },
    { label: "Appearance", value: transformedProduct?.appearance || "Glossy" },
    { label: "Care Instruction", value: transformedProduct?.careInstruction || "Wipe With A Dry Cloth" },
    { label: "Assembly Required", value: transformedProduct?.assemblyRequired || "Already Assembled" },
    { label: "Availability", value: transformedProduct?.availability || "In Stock" },
  ];

  if (loading) {
    return (
      <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf8e44] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product || !transformedProduct) {
    return (
      <div className="w-full bg-[#fffcf7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fffcf7] min-h-screen font-sans pb-8 md:pb-20 relative">
      
      {/* Main Triple Image Slider Section */}
      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[500px] mb-4 md:mb-6">
        <div className="flex h-full w-full">
          {isMobile ? (
            <div className="w-full h-full overflow-hidden">
              <img 
                src={images[currentImageIndex]} 
                className="w-full h-full object-cover" 
                alt={transformedProduct.name}
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = fallbackImages[0];
                }}
              />
            </div>
          ) : (
            <>
              <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
                <img 
                  src={images[currentImageIndex]} 
                  className="w-full h-full object-cover" 
                  alt={transformedProduct.name}
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    e.target.src = fallbackImages[0];
                  }}
                />
              </div>
              <div className="w-1/3 h-full overflow-hidden border-r-2 border-[#fffcf7]">
                <img 
                  src={images[(currentImageIndex + 1) % images.length]} 
                  className="w-full h-full object-cover" 
                  alt={transformedProduct.name}
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    e.target.src = fallbackImages[1];
                  }}
                />
              </div>
              <div className="w-1/3 h-full overflow-hidden">
                <img 
                  src={images[(currentImageIndex + 2) % images.length]} 
                  className="w-full h-full object-cover" 
                  alt={transformedProduct.name}
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    e.target.src = fallbackImages[2];
                  }}
                />
              </div>
            </>
          )}
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide} 
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white p-1.5 md:p-2 rounded-full shadow transition-all"
        >
          <ChevronLeft size={isMobile ? 18 : 24} className="text-gray-700" />
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white p-1.5 md:p-2 rounded-full shadow transition-all"
        >
          <ChevronRight size={isMobile ? 18 : 24} className="text-gray-700" />
        </button>
      </div>

      {/* Thumbnails Section */}
      <div className="flex overflow-x-auto justify-start md:justify-center gap-1.5 md:gap-2 mb-6 md:mb-10 px-3 md:px-4 py-2 scrollbar-hide">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentImageIndex(idx)}
            className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 border-2 cursor-pointer transition-all ${currentImageIndex === idx ? 'border-[#bf8e44]' : 'border-gray-200'}`}
          >
            <img 
              src={img} 
              alt={`${transformedProduct.name} thumbnail ${idx + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Thumbnail failed to load:', e.target.src);
                e.target.src = fallbackImages[idx % fallbackImages.length];
              }}
            />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Product Title & Action Row */}
        <div className="flex flex-col justify-between items-start mb-6 md:mb-8 gap-3 md:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-2 md:gap-0">
            <p className="text-[#0E0E0E] text-xs sm:text-[10px] md:text-[14px] font-medium tracking-wide mona order-2 sm:order-1 sm:w-auto w-full text-center sm:text-left">
              Ratoomal's Heritage Collection
            </p>
            <h1 className="text-lg sm:text-2xl md:text-3xl text-center sm:text-left w-full sm:w-1/2 mx-auto mona font-bold text-[#1a1a1a] order-1 sm:order-2">
              {transformedProduct.name}
            </h1>
          </div>
        </div>

        {/* Price and Buttons Row */}
        <div className="flex flex-col border justify-between items-start md:items-center mb-8 md:mb-10 border-b border-gray-200 pb-6 md:pb-10 gap-4">
          <div className="text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between w-full font-medium gap-2 sm:gap-0">
            <div className="w-full sm:w-auto">
              <span className="text-gray-500 mona font-normal">Minimum Order Quantity:</span> 
              <span className="text-black mona font-bold ml-1">{transformedProduct.moq} Piece</span>
            </div>
            <div className="text-base mona sm:text-md md:text-lg w-full sm:w-1/2 text-center sm:text-center font-black text-[#1a1a1a]">
              ₹ {transformedProduct.price}/Piece
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-8 w-full sm:w-auto justify-center sm:justify-start">
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-full bg-white text-xs font-semibold hover:bg-gray-50 transition flex-shrink-0">
                  <Heart size={isMobile ? 16 : 18} className="text-gray-600" /> 
                  <span className="hidden sm:inline">Saved</span>
                </button>
                <button className="px-4 sm:px-6 mona py-2.5 sm:py-3 bg-[#C08237] text-white rounded-full font-semibold text-xs hover:bg-[#a67a38] transition shadow-md whitespace-nowrap">
                  Send Product Inquiry →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specs and Description Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
          
          {/* Specifications (Left Side) */}
          <div className="lg:col-span-4">
            <h3 className="text-sm md:text-lg mona font-bold mb-2 md:mb-3 text-[#111]">Product Specifications</h3>
            <div className="border border-[#eee] rounded-sm bg-white overflow-hidden">
              {productSpecs.map((spec, index) => (
                <div key={index} className="flex flex-col sm:flex-row border-b border-[#D7CEC2] last:border-b-0 text-xs sm:text-[13px]">
                  <div className="w-full sm:w-1/2 px-3 py-2 font-medium text-[#0E0E0E] sm:border-r border-[#D7CEC2] mona bg-[#fafafa]">
                    {spec.label}
                  </div>
                  <div className="w-full sm:w-1/2 px-3 py-2 mona text-gray-600">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description (Right Side) */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            <div>
              <h3 className="text-sm md:text-lg mona font-bold mb-4 md:mb-6 text-[#111]">Product Description</h3>
              <div className="space-y-1">
                <h4 className="text-xs md:text-[14px] mona font-bold text-[#111] leading-snug">
                  {transformedProduct.shortDescription}
                </h4>
                
                <p className="text-xs mona md:text-[13px] text-gray-700 leading-relaxed font-medium md:leading-[1.8]">
                  {transformedProduct.longDescription}
                </p>
              </div>
              <hr className='my-3 md:my-4 text-[#D7CEC2]'/>
              <div className="mt-2 md:mt-3 space-y-2 md:space-y-3">
                <h4 className="text-sm md:text-lg mona font-bold text-[#111]">Key Features:</h4>
                <div className="space-y-1.5 text-xs md:text-[14px] mona">
                  {transformedProduct.features.map((feature, index) => (
                    <p key={index}>{feature}</p>
                  ))}
                </div>
              </div>
               <hr className='my-4 md:my-6 text-[#D7CEC2]'/>
            </div>

            {/* Bulk Ordering Benefits */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="mona text-[#111] md:text-md text-sm md:text-lg mona font-bold">Bulk Ordering Benefits:</h4>
              <div className="space-y-1.5">
                <p className="text-xs md:text-[14px] mona">
                  <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Wholesale Prices:</span> Enjoy significant cost savings with our bulk purchasing options. Ideal for businesses, religious events, and community celebrations.
                </p>
                <p className="text-xs md:text-[14px] mona">
                  <span className="font-bold mona border-b border-[#bf8e44] pb-0.5">Online Wholesale Market:</span> Conveniently browse and order products online. Our wholesale market offers competitive prices and a seamless shopping experience.
                </p>
                <p className="text-xs md:text-[14px] mona">
                  <span className="font-bold border-b mona border-[#bf8e44] pb-0.5">Flexible Purchase Options:</span> Whether you need to buy in bulk online or make a single large purchase, our platform supports all your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='my-6 md:my-8 px-4 sm:px-6 md:px-0'>
        <ProductInquiry/>
      </div>

      <div className='my-6 md:my-8 px-4 sm:px-6 md:px-0'>
        <WhyChooseSection/>
      </div>
    </div>
  );
};

export default ProductDetailPage;