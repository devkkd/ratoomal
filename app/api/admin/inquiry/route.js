// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Inquiry from "@/models/Inquiry";
// import User from "@/models/User";
// import Product from "@/models/Product";
// import { sendEmail } from "@/lib/mailer";

// // CREATE INQUIRY
// export async function POST(request) {
//   await connectDB();

//   try {
//     const body = await request.json();
//     const { cartProducts, inquiryFor, estimatedQuantity, customizationNeeded, message, userEmail } = body;
    
//     console.log('Received inquiry request for user:', userEmail);
    
//     // Find user by email (simple approach)
//     if (!userEmail) {
//       return NextResponse.json({
//         success: false,
//         error: 'User email is required. Please login again.'
//       }, { status: 401 });
//     }
    
//     const user = await User.findOne({ businessEmail: userEmail }).select('-password');
    
//     if (!user) {
//       return NextResponse.json({
//         success: false,
//         error: 'User not found. Please login again.'
//       }, { status: 401 });
//     }

//     console.log('User found:', user.companyName);

//     // Validate required fields
//     if (!cartProducts || cartProducts.length === 0) {
//       return NextResponse.json({
//         success: false,
//         error: 'No products in cart'
//       }, { status: 400 });
//     }

//     if (!inquiryFor || !estimatedQuantity || !customizationNeeded || !message) {
//       return NextResponse.json({
//         success: false,
//         error: 'All fields are required'
//       }, { status: 400 });
//     }

//     // Process cart products to combine same products
//     const processedProducts = [];
//     const productMap = new Map();
    
//     cartProducts.forEach(product => {
//       const key = product.productId;
      
//       if (productMap.has(key)) {
//         // Product already exists, combine quantities and sizes
//         const existing = productMap.get(key);
//         existing.quantity += product.quantity;
//         // Combine sizes and remove duplicates
//         existing.selectedSizes = [...new Set([...existing.selectedSizes, ...product.selectedSizes])];
//       } else {
//         // New product
//         productMap.set(key, {
//           productId: product.productId,
//           quantity: product.quantity,
//           selectedSizes: [...product.selectedSizes]
//         });
//       }
//     });
    
//     // Convert map back to array
//     processedProducts.push(...productMap.values());

//     // Calculate totals
//     const totalProducts = processedProducts.length;
//     const totalQuantity = processedProducts.reduce((sum, product) => sum + product.quantity, 0);

//     console.log('Processing inquiry:', {
//       totalProducts,
//       totalQuantity,
//       inquiryFor,
//       estimatedQuantity,
//       customizationNeeded
//     });

//     // Create inquiry
//     const inquiryData = {
//       user: user._id,
//       inquiryType: 'cart_inquiry',
//       cartProducts: processedProducts,
//       totalProducts,
//       totalQuantity,
//       inquiryFor,
//       estimatedQuantity,
//       customizationNeeded,
//       message: message.trim()
//     };

//     const inquiry = await Inquiry.create(inquiryData);
    
//     console.log("Inquiry created successfully:", inquiry._id);

//     // Send email to admin
//     try {
//       // Simple email template
//       const emailSubject = `New Cart Inquiry from ${user.companyName}`;
//       const emailHtml = `
//         <h2>New Cart Inquiry Received</h2>
//         <p><strong>Company:</strong> ${user.companyName}</p>
//         <p><strong>Contact:</strong> ${user.contactName}</p>
//         <p><strong>Email:</strong> ${user.businessEmail}</p>
//         <p><strong>Total Products:</strong> ${totalProducts}</p>
//         <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
//         <p><strong>Inquiry For:</strong> ${inquiryFor}</p>
//         <p><strong>Estimated Quantity:</strong> ${estimatedQuantity}</p>
//         <p><strong>Customization:</strong> ${customizationNeeded}</p>
//         <p><strong>Message:</strong> ${message}</p>
//       `;

//       console.log("SENDING CART INQUIRY NOTIFICATION TO ADMIN");

//       await sendEmail({
//         to: process.env.ADMIN_EMAIL,
//         subject: emailSubject,
//         html: emailHtml,
//       });

//       console.log("CART INQUIRY ADMIN NOTIFICATION SENT ✅");
//     } catch (err) {
//       console.error("CART INQUIRY EMAIL SEND FAILED ❌", err);
//       // Don't fail the whole request if email fails
//     }

//     return NextResponse.json({
//       success: true,
//       data: {
//         id: inquiry._id,
//         totalProducts,
//         totalQuantity
//       },
//       message: 'Inquiry submitted successfully'
//     });

//   } catch (error) {
//     console.error('Error creating inquiry:', error);
//     return NextResponse.json({
//       success: false,
//       error: error.message || 'Failed to create inquiry'
//     }, { status: 500 });
//   }
// }

// // GET ALL INQUIRIES (Admin) - with product details
// export async function GET(request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const inquiryId = searchParams.get('inquiryId');
//     const downloadExcel = searchParams.get('downloadExcel');

//     // If specific inquiry requested for CSV download
//     if (inquiryId && downloadExcel === 'true') {
//       console.log(`CSV download requested for inquiry: ${inquiryId}`);
//       return await generateCSVReport(inquiryId);
//     }

//     // Debug endpoint - if debug parameter is provided
//     if (inquiryId && searchParams.get('debug') === 'true') {
//       console.log(`Debug mode requested for inquiry: ${inquiryId}`);
      
//       const debugInquiry = await Inquiry
//         .findById(inquiryId)
//         .populate('user', '-password')
//         .lean();
      
//       if (!debugInquiry) {
//         return NextResponse.json({
//           success: false,
//           error: 'Inquiry not found'
//         }, { status: 404 });
//       }

//       // Fetch product details for debugging
//       let debugProducts = [];
//       if (debugInquiry.cartProducts && debugInquiry.cartProducts.length > 0) {
//         console.log(`🔍 Debug: Processing ${debugInquiry.cartProducts.length} cart products`);
        
//         for (let i = 0; i < debugInquiry.cartProducts.length; i++) {
//           const cartProduct = debugInquiry.cartProducts[i];
//           console.log(`🔍 Debug: Processing product ${i + 1}: ${cartProduct.productId}`);
          
//           try {
//             const product = await Product.findById(cartProduct.productId)
//               .populate('category', 'name')
//               .populate('subCategory', 'name')
//               .lean();
            
//             debugProducts.push({
//               index: i + 1,
//               cartProduct: {
//                 productId: cartProduct.productId,
//                 quantity: cartProduct.quantity,
//                 selectedSizes: cartProduct.selectedSizes
//               },
//               productDetails: product,
//               found: !!product,
//               productName: product?.name || 'Not found',
//               productCode: product?.code || 'No code'
//             });
            
//             console.log(`🔍 Debug: Product ${i + 1} - ${product ? 'FOUND' : 'NOT FOUND'}: ${product?.name || 'N/A'}`);
//           } catch (error) {
//             console.error(`🔍 Debug: Error processing product ${cartProduct.productId}:`, error);
//             debugProducts.push({
//               index: i + 1,
//               cartProduct: {
//                 productId: cartProduct.productId,
//                 quantity: cartProduct.quantity,
//                 selectedSizes: cartProduct.selectedSizes
//               },
//               productDetails: null,
//               found: false,
//               error: error.message,
//               productName: 'Error',
//               productCode: 'Error'
//             });
//           }
//         }
        
//         console.log(`🔍 Debug: Processed ${debugProducts.length} products total`);
//       } else {
//         console.log(`🔍 Debug: No cart products found`);
//       }

//       return NextResponse.json({
//         success: true,
//         debug: {
//           inquiryId: debugInquiry._id,
//           companyName: debugInquiry.user?.companyName,
//           rawCartProducts: debugInquiry.cartProducts,
//           cartProductsCount: debugInquiry.cartProducts?.length || 0,
//           productsWithDetails: debugProducts,
//           productsFound: debugProducts.filter(p => p.found).length,
//           productsNotFound: debugProducts.filter(p => !p.found).length,
//           totalProducts: debugInquiry.totalProducts,
//           totalQuantity: debugInquiry.totalQuantity,
//           summary: {
//             expectedProducts: debugInquiry.cartProducts?.length || 0,
//             processedProducts: debugProducts.length,
//             foundProducts: debugProducts.filter(p => p.found).length,
//             allProductsFound: debugProducts.every(p => p.found)
//           }
//         }
//       });
//     }

//     // Get all inquiries with populated data
//     const inquiries = await Inquiry
//       .find()
//       .populate('user', '-password')
//       .populate('product')
//       .sort({ createdAt: -1 })
//       .lean(); // Use lean for better performance

//     // Fetch product details for cart products
//     const inquiriesWithProducts = await Promise.all(
//       inquiries.map(async (inquiry) => {
//         if (inquiry.cartProducts && inquiry.cartProducts.length > 0) {
//           const productsWithDetails = await Promise.all(
//             inquiry.cartProducts.map(async (cartProduct) => {
//               try {
//                 const product = await Product.findById(cartProduct.productId)
//                   .populate('category', 'name')
//                   .populate('subCategory', 'name')
//                   .select('name images thumbnail price code category subCategory')
//                   .lean();
                
//                 return {
//                   ...cartProduct,
//                   productDetails: product
//                 };
//               } catch (error) {
//                 console.error('Error fetching product details for:', cartProduct.productId, error);
//                 return {
//                   ...cartProduct,
//                   productDetails: null
//                 };
//               }
//             })
//           );
          
//           return {
//             ...inquiry,
//             cartProducts: productsWithDetails
//           };
//         }
//         return inquiry;
//       })
//     );

//     return NextResponse.json({
//       success: true,
//       data: inquiriesWithProducts,
//     });

//   } catch (error) {
//     console.error('Error fetching inquiries:', error);
//     return NextResponse.json({
//       success: false,
//       error: error.message || 'Failed to fetch inquiries',
//       details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     }, { status: 500 });
//   }
// }

// // Generate CSV Report for specific inquiry
// async function generateCSVReport(inquiryId) {
//   try {
//     console.log(`🚀 STARTING CSV GENERATION FOR INQUIRY: ${inquiryId}`);
    
//     await connectDB();
    
//     // Get inquiry with all details
//     const inquiry = await Inquiry
//       .findById(inquiryId)
//       .populate('user', '-password')
//       .lean();

//     if (!inquiry) {
//       console.error(`❌ Inquiry not found: ${inquiryId}`);
//       return NextResponse.json({
//         success: false,
//         error: 'Inquiry not found'
//       }, { status: 404 });
//     }

//     console.log(`✅ Found inquiry for: ${inquiry.user?.companyName || 'Unknown Company'}`);
//     console.log(`📊 Raw inquiry.cartProducts:`, JSON.stringify(inquiry.cartProducts, null, 2));
//     console.log(`📊 cartProducts length: ${inquiry.cartProducts?.length || 0}`);

//     // CRITICAL CHECK: Ensure we have cartProducts
//     if (!inquiry.cartProducts || !Array.isArray(inquiry.cartProducts)) {
//       console.error(`❌ cartProducts is not an array:`, typeof inquiry.cartProducts);
//       console.error(`❌ cartProducts value:`, inquiry.cartProducts);
      
//       // Return error CSV
//       const errorCSV = `ERROR: No cart products found\nInquiry ID: ${inquiryId}\nCartProducts: ${JSON.stringify(inquiry.cartProducts)}`;
//       return new NextResponse(errorCSV, {
//         status: 200,
//         headers: {
//           'Content-Type': 'text/csv; charset=utf-8',
//           'Content-Disposition': `attachment; filename="Error_${inquiryId}.csv"`,
//         },
//       });
//     }

//     if (inquiry.cartProducts.length === 0) {
//       console.error(`❌ cartProducts array is empty`);
      
//       // Return error CSV
//       const errorCSV = `ERROR: Cart products array is empty\nInquiry ID: ${inquiryId}\nTotal Products: ${inquiry.totalProducts}\nTotal Quantity: ${inquiry.totalQuantity}`;
//       return new NextResponse(errorCSV, {
//         status: 200,
//         headers: {
//           'Content-Type': 'text/csv; charset=utf-8',
//           'Content-Disposition': `attachment; filename="Empty_Cart_${inquiryId}.csv"`,
//         },
//       });
//     }

//     // Process each product individually - GUARANTEED processing
//     let productsWithDetails = [];
    
//     console.log(`🔄 PROCESSING ${inquiry.cartProducts.length} PRODUCTS:`);
    
//     for (let i = 0; i < inquiry.cartProducts.length; i++) {
//       const cartProduct = inquiry.cartProducts[i];
      
//       console.log(`\n🔍 PROCESSING PRODUCT ${i + 1}/${inquiry.cartProducts.length}:`);
//       console.log(`   - Product ID: ${cartProduct.productId}`);
//       console.log(`   - Quantity: ${cartProduct.quantity}`);
//       console.log(`   - Selected Sizes: ${JSON.stringify(cartProduct.selectedSizes)}`);
      
//       try {
//         const product = await Product.findById(cartProduct.productId)
//           .populate('category', 'name')
//           .populate('subCategory', 'name')
//           .lean();
        
//         const productData = {
//           productId: cartProduct.productId,
//           quantity: cartProduct.quantity || 0,
//           selectedSizes: cartProduct.selectedSizes || [],
//           productDetails: product || {
//             name: 'Product Not Found',
//             code: cartProduct.productId,
//             category: { name: 'N/A' },
//             subCategory: { name: 'N/A' },
//             price: 0,
//             images: []
//           }
//         };
        
//         productsWithDetails.push(productData);
        
//         if (product) {
//           console.log(`   ✅ FOUND: ${product.name} (Code: ${product.code})`);
//         } else {
//           console.log(`   ❌ NOT FOUND: ${cartProduct.productId}`);
//         }
        
//       } catch (error) {
//         console.error(`   💥 ERROR: ${error.message}`);
        
//         const errorProductData = {
//           productId: cartProduct.productId,
//           quantity: cartProduct.quantity || 0,
//           selectedSizes: cartProduct.selectedSizes || [],
//           productDetails: {
//             name: 'Error Loading Product',
//             code: cartProduct.productId,
//             category: { name: 'N/A' },
//             subCategory: { name: 'N/A' },
//             price: 0,
//             images: []
//           }
//         };
        
//         productsWithDetails.push(errorProductData);
//       }
//     }
    
//     console.log(`\n📊 PROCESSING COMPLETE:`);
//     console.log(`   - Original cartProducts: ${inquiry.cartProducts.length}`);
//     console.log(`   - Processed products: ${productsWithDetails.length}`);
//     console.log(`   - Processing successful: ${productsWithDetails.length === inquiry.cartProducts.length ? '✅ YES' : '❌ NO'}`);
    
//     // Log each processed product
//     productsWithDetails.forEach((p, idx) => {
//       console.log(`   Product ${idx + 1}: ${p.productDetails?.name} (ID: ${p.productId}, Qty: ${p.quantity})`);
//     });

//     // CRITICAL CHECK: Ensure we processed all products
//     if (productsWithDetails.length !== inquiry.cartProducts.length) {
//       console.error(`❌ MISMATCH: Expected ${inquiry.cartProducts.length}, got ${productsWithDetails.length}`);
      
//       // Return debug CSV
//       const debugCSV = `PROCESSING ERROR\nExpected Products: ${inquiry.cartProducts.length}\nProcessed Products: ${productsWithDetails.length}\nRaw Data: ${JSON.stringify(inquiry.cartProducts, null, 2)}`;
//       return new NextResponse(debugCSV, {
//         status: 200,
//         headers: {
//           'Content-Type': 'text/csv; charset=utf-8',
//           'Content-Disposition': `attachment; filename="Debug_Mismatch_${inquiryId}.csv"`,
//         },
//       });
//     }

//     // Create CSV content with improved formatting
//     let csvContent = '';
    
//     // Header with company info
//     csvContent += `RATOOMAL INQUIRY REPORT\n`;
//     csvContent += `Company: ${inquiry.user?.companyName || 'N/A'}\n`;
//     csvContent += `Generated: ${new Date().toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })}\n`;
//     csvContent += `Inquiry ID: ${inquiry._id}\n`;
//     csvContent += `\n`;

//     // Customer Information Section
//     csvContent += `CUSTOMER INFORMATION\n`;
//     csvContent += `Company Name,"${(inquiry.user?.companyName || 'N/A').replace(/"/g, '""')}"\n`;
//     csvContent += `Contact Person,"${(inquiry.user?.contactName || 'N/A').replace(/"/g, '""')}"\n`;
//     csvContent += `Business Email,"${inquiry.user?.businessEmail || 'N/A'}"\n`;
//     csvContent += `Phone Number,"${inquiry.user?.phone || 'N/A'}"\n`;
//     csvContent += `Country,"${inquiry.user?.country || 'N/A'}"\n`;
//     csvContent += `Business Type,"${inquiry.user?.businessType || 'N/A'}"\n`;
//     csvContent += `Purpose,"${inquiry.user?.purpose || 'N/A'}"\n`;
//     csvContent += `\n`;

//     // Inquiry Details Section
//     csvContent += `INQUIRY DETAILS\n`;
//     csvContent += `Inquiry Type,"${inquiry.inquiryType || 'cart_inquiry'}"\n`;
//     csvContent += `Inquiry For,"${(inquiry.inquiryFor || 'N/A').replace(/_/g, ' ')}"\n`;
//     csvContent += `Estimated Quantity,"${inquiry.estimatedQuantity || 'N/A'}"\n`;
//     csvContent += `Customization Needed,"${(inquiry.customizationNeeded || 'N/A').replace(/_/g, ' ')}"\n`;
//     csvContent += `Total Products,${inquiry.totalProducts || productsWithDetails.length}\n`;
//     csvContent += `Total Quantity,${inquiry.totalQuantity || productsWithDetails.reduce((sum, item) => sum + (item.quantity || 0), 0)}\n`;
//     csvContent += `Current Status,"${inquiry.status || 'pending'}"\n`;
//     csvContent += `Inquiry Date,"${new Date(inquiry.createdAt).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })}"\n`;
//     if (inquiry.respondedAt) {
//       csvContent += `Response Date,"${new Date(inquiry.respondedAt).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       })}"\n`;
//     }
//     csvContent += `\n`;

//     // Customer Message Section
//     csvContent += `CUSTOMER MESSAGE\n`;
//     const cleanMessage = (inquiry.message || 'No message provided')
//       .replace(/"/g, '""')
//       .replace(/[\r\n]+/g, ' ')
//       .trim();
//     csvContent += `"${cleanMessage}"\n`;
//     csvContent += `\n`;

//     // Admin Notes Section
//     if (inquiry.adminNotes) {
//       csvContent += `ADMIN NOTES\n`;
//       const cleanNotes = inquiry.adminNotes
//         .replace(/"/g, '""')
//         .replace(/[\r\n]+/g, ' ')
//         .trim();
//       csvContent += `"${cleanNotes}"\n`;
//       csvContent += `\n`;
//     }

//     // Products Section Header
//     csvContent += `REQUESTED PRODUCTS\n`;
    
//     console.log(`🚨 CRITICAL DEBUG - PRODUCTS SECTION:`);
//     console.log(`   - productsWithDetails.length: ${productsWithDetails.length}`);
//     console.log(`   - inquiry.cartProducts.length: ${inquiry.cartProducts?.length || 0}`);
    
//     if (productsWithDetails.length === 0) {
//       console.log(`❌ NO PRODUCTS TO ADD TO CSV`);
//       csvContent += `No products found in this inquiry.\n`;
//       csvContent += `Raw cartProducts: ${JSON.stringify(inquiry.cartProducts)}\n`;
//       csvContent += `\n`;
//     } else {
//       console.log(`✅ ADDING ${productsWithDetails.length} PRODUCTS TO CSV`);
      
//       // CSV Headers
//       csvContent += `Sr No,Product Code,Product Name,Category,Sub Category,Quantity,Selected Sizes,Unit Price (INR),Total Value (INR),Image URL\n`;
      
//       // CRITICAL: Use simple approach - add each product one by one
//       let productRowsAdded = 0;
      
//       productsWithDetails.forEach((item, index) => {
//         const product = item.productDetails;
        
//         console.log(`🔥 ADDING PRODUCT ${index + 1}:`);
//         console.log(`   - Product ID: ${item.productId}`);
//         console.log(`   - Product Name: ${product?.name || 'Unknown'}`);
//         console.log(`   - Quantity: ${item.quantity}`);
        
//         // Handle sizes
//         let sizes = 'Standard Size';
//         if (item.selectedSizes && Array.isArray(item.selectedSizes) && item.selectedSizes.length > 0) {
//           const validSizes = item.selectedSizes.filter(size => size && size.toString().trim());
//           if (validSizes.length > 0) {
//             sizes = validSizes.join(' | ');
//           }
//         }
        
//         // Clean data
//         const productName = (product?.name || 'Product not found').replace(/"/g, '""');
//         const categoryName = (product?.category?.name || 'N/A').replace(/"/g, '""');
//         const subCategoryName = (product?.subCategory?.name || 'N/A').replace(/"/g, '""');
//         const productCode = (product?.code || item.productId || 'N/A').replace(/"/g, '""');
//         const unitPrice = product?.price || 0;
//         const quantity = item.quantity || 0;
//         const totalValue = unitPrice * quantity;
//         const imageUrl = product?.images?.[0] || product?.thumbnail || 'No image available';
        
//         // Create and add CSV row
//         const csvRow = `${index + 1},"${productCode}","${productName}","${categoryName}","${subCategoryName}",${quantity},"${sizes}",${unitPrice},${totalValue},"${imageUrl}"`;
        
//         console.log(`   - CSV Row: ${csvRow.substring(0, 100)}...`);
        
//         csvContent += csvRow + '\n';
//         productRowsAdded++;
        
//         console.log(`   ✅ Product ${index + 1} SUCCESSFULLY ADDED TO CSV`);
//       });
      
//       console.log(`🎯 FINAL RESULT: ${productRowsAdded} product rows added to CSV`);
//       console.log(`🎯 Expected: ${productsWithDetails.length}, Added: ${productRowsAdded}`);
//     }

//     // Summary Section
//     csvContent += `\n`;
//     csvContent += `ORDER SUMMARY\n`;
//     const finalTotalValue = productsWithDetails.reduce((sum, item) => {
//       const price = item.productDetails?.price || 0;
//       return sum + (price * (item.quantity || 0));
//     }, 0);
//     const finalTotalQuantity = productsWithDetails.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
//     csvContent += `Total Products,${productsWithDetails.length}\n`;
//     csvContent += `Total Quantity,${finalTotalQuantity}\n`;
//     csvContent += `Estimated Order Value,"₹${finalTotalValue.toLocaleString('en-IN')}"\n`;
//     csvContent += `\n`;

//     // Footer
//     csvContent += `REPORT GENERATED BY RATOOMAL ADMIN PANEL\n`;
//     csvContent += `Contact: ${process.env.ADMIN_EMAIL || 'admin@ratoomal.com'}\n`;
//     csvContent += `Website: https://ratoomal.com\n`;

//     console.log(`🎯 CSV GENERATION COMPLETED SUCCESSFULLY`);
//     console.log(`📊 FINAL STATISTICS:`);
//     console.log(`   - Total content length: ${csvContent.length} characters`);
//     console.log(`   - Products included in CSV: ${productsWithDetails.length}`);
//     console.log(`   - Expected products from DB: ${inquiry.cartProducts?.length || 0}`);
//     console.log(`   - Products match: ${productsWithDetails.length === (inquiry.cartProducts?.length || 0) ? '✅ YES' : '❌ NO'}`);
    
//     // Count actual product rows in CSV content
//     const productRowsInCSV = (csvContent.match(/^\d+,"/gm) || []).length;
//     console.log(`   - Product rows in CSV: ${productRowsInCSV}`);
//     console.log(`   - CSV rows match products: ${productRowsInCSV === productsWithDetails.length ? '✅ YES' : '❌ NO'}`);
    
//     // Final verification
//     if (productRowsInCSV !== productsWithDetails.length) {
//       console.error(`🚨 CRITICAL ERROR: CSV rows (${productRowsInCSV}) don't match products (${productsWithDetails.length})`);
//     }
    
//     console.log(`📄 CSV content preview (first 1000 chars):`, csvContent.substring(0, 1000));

//     // Create filename with better format and safety
//     const companyName = inquiry.user?.companyName
//       ? inquiry.user.companyName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 30)
//       : 'Unknown_Company';
//     const dateStr = new Date().toISOString().split('T')[0];
//     const timeStr = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
//     const filename = `Ratoomal_Inquiry_${companyName}_${dateStr}_${timeStr}.csv`;

//     console.log(`Returning CSV file: ${filename}`);

//     // Return CSV file
//     return new NextResponse(csvContent, {
//       status: 200,
//       headers: {
//         'Content-Type': 'text/csv; charset=utf-8',
//         'Content-Disposition': `attachment; filename="${filename}"`,
//       },
//     });

//   } catch (error) {
//     console.error('Error generating CSV report:', error);
//     return NextResponse.json({
//       success: false,
//       error: error.message || 'Failed to generate CSV report'
//     }, { status: 500 });
//   }
// }

// // UPDATE INQUIRY STATUS (Admin)
// export async function PUT(request) {
//   await connectDB();

//   try {
//     const body = await request.json();
//     const { inquiryId, status, adminNotes } = body;

//     if (!inquiryId || !status) {
//       return NextResponse.json({
//         success: false,
//         error: 'Inquiry ID and status are required'
//       }, { status: 400 });
//     }

//     // Validate status
//     const validStatuses = ['pending', 'reviewed', 'responded', 'closed'];
//     if (!validStatuses.includes(status)) {
//       return NextResponse.json({
//         success: false,
//         error: 'Invalid status'
//       }, { status: 400 });
//     }

//     const updateData = {
//       status,
//       ...(adminNotes && { adminNotes }),
//       ...(status === 'responded' && { respondedAt: new Date() })
//     };

//     const inquiry = await Inquiry.findByIdAndUpdate(
//       inquiryId,
//       updateData,
//       { new: true }
//     ).populate('user', '-password');

//     if (!inquiry) {
//       return NextResponse.json({
//         success: false,
//         error: 'Inquiry not found'
//       }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       data: inquiry,
//       message: 'Inquiry status updated successfully'
//     });

//   } catch (error) {
//     console.error('Error updating inquiry status:', error);
//     return NextResponse.json({
//       success: false,
//       error: error.message || 'Failed to update inquiry status'
//     }, { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import User from "@/models/User";
import Product from "@/models/Product";
import { sendEmail } from "@/lib/mailer";
import { adminNewInquiryTemplate } from "@/lib/emailTemplates";

// CREATE INQUIRY
export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();

    // ── Product-specific inquiry (from productInquiry page) ──────────────────
    // These come with: product, companyName, contactName, email, phone, country, etc.
    if (body.product && !body.cartProducts) {
      const { product, companyName, contactName, email, phone, country,
              inquiryType, quantity, customization, message } = body;

      if (!companyName || !contactName || !email || !phone || !inquiryType || !quantity) {
        return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
      }

      // Fetch product name for the email
      let productDoc = null;
      try { productDoc = await Product.findById(product).select('name code').lean(); } catch (_) {}

      const inquiryPayload = {
        inquiryType: 'product_inquiry',
        product,
        companyName,
        contactName,
        email,
        phone,
        country,
        inquiryType: inquiryType || 'product_inquiry',
        quantity,
        customization,
        message,
      };

      // Send admin notification email
      try {
        const emailTemplate = adminNewInquiryTemplate({
          ...inquiryPayload,
          product: productDoc || { name: product },
        });
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
        console.log("✅ Product inquiry admin email sent");
      } catch (emailErr) {
        console.error("❌ Product inquiry admin email failed:", emailErr.message);
      }

      // Send confirmation to customer
      try {
        await sendEmail({
          to: email,
          subject: `Your Product Inquiry is Being Processed — Ratoomal`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h1 style="color: #C18E4D; text-align: center; margin-bottom: 6px;">Thank You for Your Inquiry!</h1>
                <p style="color: #666; text-align: center; font-size: 14px;">We've received your product inquiry and will respond within 24–48 hours.</p>
                <div style="background-color: #FFF6EB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #2D2D2D; margin: 0 0 12px;">Inquiry Summary</h3>
                  <p style="font-size: 14px; margin: 4px 0;"><strong>Product:</strong> ${productDoc?.name || product}</p>
                  <p style="font-size: 14px; margin: 4px 0;"><strong>Company:</strong> ${companyName}</p>
                  <p style="font-size: 14px; margin: 4px 0;"><strong>Inquiry Type:</strong> ${inquiryType}</p>
                  <p style="font-size: 14px; margin: 4px 0;"><strong>Quantity:</strong> ${quantity}</p>
                </div>
                <p style="color: #C18E4D; font-weight: bold; text-align: center; font-size: 14px;">
                  Need help? Email us at ${process.env.ADMIN_EMAIL || 'info@ratoomal.com'}
                </p>
              </div>
            </div>
          `,
        });
        console.log("✅ Product inquiry customer confirmation email sent to:", email);
      } catch (emailErr) {
        console.error("❌ Product inquiry customer email failed:", emailErr.message);
      }

      return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' });
    }

    // ── Cart inquiry (from inquiry-cart page) ────────────────────────────────
    const { cartProducts, inquiryFor, customizationNeeded, message, userEmail } = body;
    
    console.log('Received inquiry request for user:', userEmail);
    
    // Find user by email (simple approach)
    if (!userEmail) {
      return NextResponse.json({
        success: false,
        error: 'User email is required. Please login again.'
      }, { status: 401 });
    }
    
    const user = await User.findOne({ businessEmail: userEmail }).select('-password');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found. Please login again.'
      }, { status: 401 });
    }

    console.log('User found:', user.companyName);

    // Validate required fields
    if (!cartProducts || cartProducts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No products in cart'
      }, { status: 400 });
    }

    if (!inquiryFor || !customizationNeeded || !message) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    // Process cart products to combine same products
    const processedProducts = [];
    const productMap = new Map();
    
    cartProducts.forEach(product => {
      const key = product.productId;
      
      if (productMap.has(key)) {
        // Product already exists, combine quantities and sizes
        const existing = productMap.get(key);
        existing.quantity += product.quantity;
        // Combine sizes and remove duplicates
        existing.selectedSizes = [...new Set([...existing.selectedSizes, ...product.selectedSizes])];
      } else {
        // New product
        productMap.set(key, {
          productId: product.productId,
          quantity: product.quantity,
          selectedSizes: [...product.selectedSizes]
        });
      }
    });
    
    // Convert map back to array
    processedProducts.push(...productMap.values());

    // Calculate totals
    const totalProducts = processedProducts.length;
    const totalQuantity = processedProducts.reduce((sum, product) => sum + product.quantity, 0);

    console.log('Processing inquiry:', {
      totalProducts,
      totalQuantity,
      inquiryFor,
      customizationNeeded
    });

    // Create inquiry
    const inquiryData = {
      user: user._id,
      inquiryType: 'cart_inquiry',
      cartProducts: processedProducts,
      totalProducts,
      totalQuantity,
      inquiryFor,
      customizationNeeded,
      message: message.trim()
    };

    const inquiry = await Inquiry.create(inquiryData);
    
    console.log("✅ Inquiry created successfully:", inquiry._id);
    console.log("📧 User email for confirmation:", user.businessEmail);
    console.log("📧 Admin email for notification:", process.env.ADMIN_EMAIL);

    // Send email to admin
    try {
      const emailSubject = `🛒 New Cart Inquiry — ${user.companyName} (${totalProducts} products, ${totalQuantity} pcs)`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #C18E4D; margin: 0 0 6px;">New Cart Inquiry</h1>
              <p style="color: #666; font-size: 14px; margin: 0;">A registered customer has submitted a cart inquiry</p>
            </div>

            <div style="background-color: #FFF6EB; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
              <h3 style="color: #2D2D2D; margin: 0 0 14px;">Customer Details</h3>
              <table style="width:100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 5px 0; color:#666; width:40%;">Company Name</td><td style="padding: 5px 0; font-weight:bold;">${user.companyName}</td></tr>
                <tr><td style="padding: 5px 0; color:#666;">Contact Person</td><td style="padding: 5px 0;">${user.contactName}</td></tr>
                <tr><td style="padding: 5px 0; color:#666;">Business Email</td><td style="padding: 5px 0;">${user.businessEmail}</td></tr>
                <tr><td style="padding: 5px 0; color:#666;">Phone / WhatsApp</td><td style="padding: 5px 0;">${user.phone || 'N/A'}</td></tr>
                <tr><td style="padding: 5px 0; color:#666;">Country</td><td style="padding: 5px 0;">${user.country || 'N/A'}</td></tr>
                <tr><td style="padding: 5px 0; color:#666;">Business Type</td><td style="padding: 5px 0;">${user.businessType || 'N/A'}</td></tr>
              </table>
            </div>

            <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
              <h3 style="color: #2D2D2D; margin: 0 0 14px;">Inquiry Details</h3>
              <table style="width:100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 5px 0; color:#666; width:40%;">Total Products</td><td style="padding: 5px 0; font-weight:bold;">${totalProducts}</td></tr>
                <tr><td style="padding: 5px 0; color:#666;">Total Quantity</td><td style="padding: 5px 0; font-weight:bold;">${totalQuantity} pieces</td></tr>
                <tr><td style="padding: 5px 0; color:#666;">Inquiry For</td><td style="padding: 5px 0;">${inquiryFor.replace(/_/g, ' ')}</td></tr>
                <tr><td style="padding: 5px 0; color:#666;">Customization</td><td style="padding: 5px 0;">${customizationNeeded.replace(/_/g, ' ')}</td></tr>
              </table>
            </div>

            ${message ? `
            <div style="background-color: #E8F4FD; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
              <h3 style="color: #2D2D2D; margin: 0 0 10px;">Message</h3>
              <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0;">${message}</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #C18E4D; font-weight: bold; font-size: 14px;">Please login to the admin panel to review and respond.</p>
              <p style="color: #999; font-size: 12px; margin-top: 10px;">Submitted on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      `;

      console.log("📧 SENDING CART INQUIRY NOTIFICATION TO ADMIN");

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: emailSubject,
        html: emailHtml,
      });

      console.log("✅ CART INQUIRY ADMIN NOTIFICATION SENT");
    } catch (err) {
      console.error("❌ CART INQUIRY EMAIL SEND FAILED:", err.message);
      // Don't fail the whole request if email fails
    }

    // Send confirmation email to user
    try {
      console.log("📧 PREPARING USER CONFIRMATION EMAIL");
      console.log("📧 Recipient:", user.businessEmail);
      
      const userEmailSubject = `Your Inquiry is Being Processed - Ratoomal`;
      const userEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #C18E4D; margin-bottom: 10px;">Thank You for Your Inquiry!</h1>
              <p style="color: #666; font-size: 16px;">Your request is being processed by our team</p>
            </div>
            
            <div style="background-color: #FFF6EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">Your Inquiry Summary</h3>
              <p><strong>Company:</strong> ${user.companyName}</p>
              <p><strong>Contact Person:</strong> ${user.contactName}</p>
              <p><strong>Total Products:</strong> ${totalProducts}</p>
              <p><strong>Total Quantity:</strong> ${totalQuantity} pieces</p>
              <p><strong>Inquiry Type:</strong> ${inquiryFor.replace(/_/g, ' ').toUpperCase()}</p>
              <p><strong>Customization:</strong> ${customizationNeeded.replace(/_/g, ' ').toUpperCase()}</p>
            </div>
            
            <div style="background-color: #E8F4FD; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">What Happens Next?</h3>
              <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
                <li>Our team will review your requirements within 24-48 hours</li>
                <li>We'll prepare a detailed quotation with pricing and availability</li>
                <li>You'll receive product catalogs and customization options</li>
                <li>Our representative will contact you to discuss next steps</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                Need immediate assistance? Contact us at:
              </p>
              <p style="color: #C18E4D; font-weight: bold; margin: 5px 0;">
                Email: ${process.env.ADMIN_EMAIL || 'info@ratoomal.com'}
              </p>
              <p style="color: #C18E4D; font-weight: bold; margin: 5px 0;">
                Website: https://ratoomal.com
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #999; font-size: 12px;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `;

      console.log("SENDING CONFIRMATION EMAIL TO USER:", user.businessEmail);

      await sendEmail({
        to: user.businessEmail,
        subject: userEmailSubject,
        html: userEmailHtml,
      });

      console.log("✅ USER CONFIRMATION EMAIL SENT SUCCESSFULLY");
    } catch (err) {
      console.error("❌ USER CONFIRMATION EMAIL SEND FAILED:", err.message);
      console.error("❌ Full error:", err);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: inquiry._id,
        totalProducts,
        totalQuantity
      },
      message: 'Inquiry submitted successfully'
    });

  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create inquiry'
    }, { status: 500 });
  }
}

// GET ALL INQUIRIES (Admin) - with product details
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get('inquiryId');
    const downloadExcel = searchParams.get('downloadExcel');

    // If specific inquiry requested for CSV download
    if (inquiryId && downloadExcel === 'true') {
      console.log(`CSV download requested for inquiry: ${inquiryId}`);
      return await generateCSVReport(inquiryId);
    }

    // Debug endpoint - if debug parameter is provided
    if (inquiryId && searchParams.get('debug') === 'true') {
      console.log(`Debug mode requested for inquiry: ${inquiryId}`);
      
      const debugInquiry = await Inquiry
        .findById(inquiryId)
        .populate('user', '-password')
        .lean();
      
      if (!debugInquiry) {
        return NextResponse.json({
          success: false,
          error: 'Inquiry not found'
        }, { status: 404 });
      }

      // Fetch product details for debugging
      let debugProducts = [];
      if (debugInquiry.cartProducts && debugInquiry.cartProducts.length > 0) {
        console.log(`🔍 Debug: Processing ${debugInquiry.cartProducts.length} cart products`);
        
        for (let i = 0; i < debugInquiry.cartProducts.length; i++) {
          const cartProduct = debugInquiry.cartProducts[i];
          console.log(`🔍 Debug: Processing product ${i + 1}: ${cartProduct.productId}`);
          
          try {
            const product = await Product.findById(cartProduct.productId)
              .populate('category', 'name')
              .populate('subCategory', 'name')
              .lean();
            
            debugProducts.push({
              index: i + 1,
              cartProduct: {
                productId: cartProduct.productId,
                quantity: cartProduct.quantity,
                selectedSizes: cartProduct.selectedSizes
              },
              productDetails: product,
              found: !!product,
              productName: product?.name || 'Not found',
              productCode: product?.code || 'No code'
            });
            
            console.log(`🔍 Debug: Product ${i + 1} - ${product ? 'FOUND' : 'NOT FOUND'}: ${product?.name || 'N/A'}`);
          } catch (error) {
            console.error(`🔍 Debug: Error processing product ${cartProduct.productId}:`, error);
            debugProducts.push({
              index: i + 1,
              cartProduct: {
                productId: cartProduct.productId,
                quantity: cartProduct.quantity,
                selectedSizes: cartProduct.selectedSizes
              },
              productDetails: null,
              found: false,
              error: error.message,
              productName: 'Error',
              productCode: 'Error'
            });
          }
        }
        
        console.log(`🔍 Debug: Processed ${debugProducts.length} products total`);
      } else {
        console.log(`🔍 Debug: No cart products found`);
      }

      return NextResponse.json({
        success: true,
        debug: {
          inquiryId: debugInquiry._id,
          companyName: debugInquiry.user?.companyName,
          rawCartProducts: debugInquiry.cartProducts,
          cartProductsCount: debugInquiry.cartProducts?.length || 0,
          productsWithDetails: debugProducts,
          productsFound: debugProducts.filter(p => p.found).length,
          productsNotFound: debugProducts.filter(p => !p.found).length,
          totalProducts: debugInquiry.totalProducts,
          totalQuantity: debugInquiry.totalQuantity,
          summary: {
            expectedProducts: debugInquiry.cartProducts?.length || 0,
            processedProducts: debugProducts.length,
            foundProducts: debugProducts.filter(p => p.found).length,
            allProductsFound: debugProducts.every(p => p.found)
          }
        }
      });
    }

    // Get all inquiries with populated data
    const inquiries = await Inquiry
      .find()
      .populate('user', '-password')
      .populate('product')
      .sort({ createdAt: -1 })
      .lean(); // Use lean for better performance

    // Fetch product details for cart products
    const inquiriesWithProducts = await Promise.all(
      inquiries.map(async (inquiry) => {
        if (inquiry.cartProducts && inquiry.cartProducts.length > 0) {
          const productsWithDetails = await Promise.all(
            inquiry.cartProducts.map(async (cartProduct) => {
              try {
                const product = await Product.findById(cartProduct.productId)
                  .populate('category', 'name')
                  .populate('subCategory', 'name')
                  .select('name images thumbnail price code category subCategory')
                  .lean();
                
                return {
                  ...cartProduct,
                  productDetails: product
                };
              } catch (error) {
                console.error('Error fetching product details for:', cartProduct.productId, error);
                return {
                  ...cartProduct,
                  productDetails: null
                };
              }
            })
          );
          
          return {
            ...inquiry,
            cartProducts: productsWithDetails
          };
        }
        return inquiry;
      })
    );

    return NextResponse.json({
      success: true,
      data: inquiriesWithProducts,
    });

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch inquiries',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// Generate CSV Report for specific inquiry - FIXED VERSION
async function generateCSVReport(inquiryId) {
  try {
    console.log(`🚀 STARTING CSV GENERATION FOR INQUIRY: ${inquiryId}`);
    
    await connectDB();
    
    // Get inquiry with all details
    const inquiry = await Inquiry
      .findById(inquiryId)
      .populate('user', '-password')
      .lean();

    if (!inquiry) {
      console.error(`❌ Inquiry not found: ${inquiryId}`);
      return NextResponse.json({
        success: false,
        error: 'Inquiry not found'
      }, { status: 404 });
    }

    console.log(`✅ Found inquiry for: ${inquiry.user?.companyName || 'Unknown Company'}`);
    console.log(`📊 Raw inquiry.cartProducts:`, JSON.stringify(inquiry.cartProducts, null, 2));
    console.log(`📊 cartProducts length: ${inquiry.cartProducts?.length || 0}`);

    // CRITICAL CHECK: Ensure we have cartProducts
    if (!inquiry.cartProducts || !Array.isArray(inquiry.cartProducts)) {
      console.error(`❌ cartProducts is not an array:`, typeof inquiry.cartProducts);
      console.error(`❌ cartProducts value:`, inquiry.cartProducts);
      
      // Return error CSV
      const errorCSV = `ERROR: No cart products found\nInquiry ID: ${inquiryId}\nCartProducts: ${JSON.stringify(inquiry.cartProducts)}`;
      return new NextResponse(errorCSV, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="Error_${inquiryId}.csv"`,
        },
      });
    }

    if (inquiry.cartProducts.length === 0) {
      console.error(`❌ cartProducts array is empty`);
      
      // Return error CSV
      const errorCSV = `ERROR: Cart products array is empty\nInquiry ID: ${inquiryId}\nTotal Products: ${inquiry.totalProducts}\nTotal Quantity: ${inquiry.totalQuantity}`;
      return new NextResponse(errorCSV, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="Empty_Cart_${inquiryId}.csv"`,
        },
      });
    }

    // Process each product individually - GUARANTEED processing
    let productsWithDetails = [];
    
    console.log(`🔄 PROCESSING ${inquiry.cartProducts.length} PRODUCTS:`);
    
    for (let i = 0; i < inquiry.cartProducts.length; i++) {
      const cartProduct = inquiry.cartProducts[i];
      
      console.log(`\n🔍 PROCESSING PRODUCT ${i + 1}/${inquiry.cartProducts.length}:`);
      console.log(`   - Product ID: ${cartProduct.productId}`);
      console.log(`   - Quantity: ${cartProduct.quantity}`);
      console.log(`   - Selected Sizes: ${JSON.stringify(cartProduct.selectedSizes)}`);
      
      try {
        const product = await Product.findById(cartProduct.productId)
          .populate('category', 'name')
          .populate('subCategory', 'name')
          .lean();
        
        const productData = {
          productId: cartProduct.productId,
          quantity: cartProduct.quantity || 0,
          selectedSizes: cartProduct.selectedSizes || [],
          productDetails: product || {
            name: 'Product Not Found',
            code: cartProduct.productId,
            category: { name: 'N/A' },
            subCategory: { name: 'N/A' },
            price: 0,
            images: []
          }
        };
        
        productsWithDetails.push(productData);
        
        if (product) {
          console.log(`   ✅ FOUND: ${product.name} (Code: ${product.code})`);
        } else {
          console.log(`   ❌ NOT FOUND: ${cartProduct.productId}`);
        }
        
      } catch (error) {
        console.error(`   💥 ERROR: ${error.message}`);
        
        const errorProductData = {
          productId: cartProduct.productId,
          quantity: cartProduct.quantity || 0,
          selectedSizes: cartProduct.selectedSizes || [],
          productDetails: {
            name: 'Error Loading Product',
            code: cartProduct.productId,
            category: { name: 'N/A' },
            subCategory: { name: 'N/A' },
            price: 0,
            images: []
          }
        };
        
        productsWithDetails.push(errorProductData);
      }
    }
    
    console.log(`\n📊 PROCESSING COMPLETE:`);
    console.log(`   - Original cartProducts: ${inquiry.cartProducts.length}`);
    console.log(`   - Processed products: ${productsWithDetails.length}`);
    console.log(`   - Processing successful: ${productsWithDetails.length === inquiry.cartProducts.length ? '✅ YES' : '❌ NO'}`);
    
    // Log each processed product
    productsWithDetails.forEach((p, idx) => {
      console.log(`   Product ${idx + 1}: ${p.productDetails?.name} (ID: ${p.productId}, Qty: ${p.quantity})`);
    });

    // CRITICAL CHECK: Ensure we processed all products
    if (productsWithDetails.length !== inquiry.cartProducts.length) {
      console.error(`❌ MISMATCH: Expected ${inquiry.cartProducts.length}, got ${productsWithDetails.length}`);
      
      // Return debug CSV
      const debugCSV = `PROCESSING ERROR\nExpected Products: ${inquiry.cartProducts.length}\nProcessed Products: ${productsWithDetails.length}\nRaw Data: ${JSON.stringify(inquiry.cartProducts, null, 2)}`;
      return new NextResponse(debugCSV, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="Debug_Mismatch_${inquiryId}.csv"`,
        },
      });
    }

    // Create CSV content with improved formatting - FIXED SECTION
    let csvContent = '';
    
    // Header with company info
    csvContent += `RATOOMAL INQUIRY REPORT\n`;
    csvContent += `Company: ${inquiry.user?.companyName || 'N/A'}\n`;
    csvContent += `Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n`;
    csvContent += `Inquiry ID: ${inquiry._id}\n`;
    csvContent += `\n`;

    // Customer Information Section
    csvContent += `CUSTOMER INFORMATION\n`;
    csvContent += `Company Name,"${(inquiry.user?.companyName || 'N/A').replace(/"/g, '""')}"\n`;
    csvContent += `Contact Person,"${(inquiry.user?.contactName || 'N/A').replace(/"/g, '""')}"\n`;
    csvContent += `Business Email,"${inquiry.user?.businessEmail || 'N/A'}"\n`;
    csvContent += `Phone Number,"${inquiry.user?.phone || 'N/A'}"\n`;
    csvContent += `Country,"${inquiry.user?.country || 'N/A'}"\n`;
    csvContent += `Business Type,"${inquiry.user?.businessType || 'N/A'}"\n`;
    csvContent += `Purpose,"${inquiry.user?.purpose || 'N/A'}"\n`;
    csvContent += `\n`;

    // Inquiry Details Section
    csvContent += `INQUIRY DETAILS\n`;
    csvContent += `Inquiry Type,"${inquiry.inquiryType || 'cart_inquiry'}"\n`;
    csvContent += `Inquiry For,"${(inquiry.inquiryFor || 'N/A').replace(/_/g, ' ')}"\n`;
    csvContent += `Customization Needed,"${(inquiry.customizationNeeded || 'N/A').replace(/_/g, ' ')}"\n`;
    csvContent += `Total Products,${inquiry.totalProducts || productsWithDetails.length}\n`;
    csvContent += `Total Quantity,${inquiry.totalQuantity || productsWithDetails.reduce((sum, item) => sum + (item.quantity || 0), 0)}\n`;
    csvContent += `Current Status,"${inquiry.status || 'pending'}"\n`;
    csvContent += `Inquiry Date,"${new Date(inquiry.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}"\n`;
    if (inquiry.respondedAt) {
      csvContent += `Response Date,"${new Date(inquiry.respondedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}"\n`;
    }
    csvContent += `\n`;

    // Customer Message Section
    csvContent += `CUSTOMER MESSAGE\n`;
    const cleanMessage = (inquiry.message || 'No message provided')
      .replace(/"/g, '""')
      .replace(/[\r\n]+/g, ' ')
      .trim();
    csvContent += `"${cleanMessage}"\n`;
    csvContent += `\n`;

    // Admin Notes Section
    if (inquiry.adminNotes) {
      csvContent += `ADMIN NOTES\n`;
      const cleanNotes = inquiry.adminNotes
        .replace(/"/g, '""')
        .replace(/[\r\n]+/g, ' ')
        .trim();
      csvContent += `"${cleanNotes}"\n`;
      csvContent += `\n`;
    }

    // Products Section Header - FIXED THIS SECTION
    csvContent += `REQUESTED PRODUCTS\n`;
    
    console.log(`🚨 CRITICAL DEBUG - PRODUCTS SECTION:`);
    console.log(`   - productsWithDetails.length: ${productsWithDetails.length}`);
    console.log(`   - inquiry.cartProducts.length: ${inquiry.cartProducts?.length || 0}`);
    
    if (productsWithDetails.length === 0) {
      console.log(`❌ NO PRODUCTS TO ADD TO CSV`);
      csvContent += `No products found in this inquiry.\n`;
      csvContent += `Raw cartProducts: ${JSON.stringify(inquiry.cartProducts)}\n`;
      csvContent += `\n`;
    } else {
      console.log(`✅ ADDING ${productsWithDetails.length} PRODUCTS TO CSV`);
      
      // CSV Headers
      csvContent += `Sr No,Product Code,Product Name,Category,Sub Category,Quantity,Selected Sizes,Image URL\n`;
      
      // FIXED: Proper CSV generation with escaping
      productsWithDetails.forEach((item, index) => {
        const product = item.productDetails;
        
        console.log(`🔥 ADDING PRODUCT ${index + 1}:`);
        console.log(`   - Product ID: ${item.productId}`);
        console.log(`   - Product Name: ${product?.name || 'Unknown'}`);
        console.log(`   - Quantity: ${item.quantity}`);
        
        // Handle sizes
        let sizes = 'Standard Size';
        if (item.selectedSizes && Array.isArray(item.selectedSizes) && item.selectedSizes.length > 0) {
          const validSizes = item.selectedSizes.filter(size => size && size.toString().trim());
          if (validSizes.length > 0) {
            sizes = validSizes.join(' | ');
          }
        }
        
        // Clean all data for CSV - FIXED ESCAPING
        const productName = (product?.name || 'Product not found')
          .replace(/"/g, '""')  // Escape double quotes
          .trim();
        
        const categoryName = (product?.category?.name || 'N/A')
          .replace(/"/g, '""')
          .trim();
        
        const subCategoryName = (product?.subCategory?.name || 'N/A')
          .replace(/"/g, '""')
          .trim();
        
        const productCode = (product?.code || item.productId || 'N/A')
          .replace(/"/g, '""')
          .trim();
        
        const quantity = item.quantity || 0;
        
        // Clean sizes string
        const cleanSizes = sizes
          .replace(/"/g, '""')  // Escape double quotes
          .trim();
        
        // Clean image URL
        const imageUrl = (product?.images?.[0] || product?.thumbnail || 'No image available')
          .replace(/"/g, '""')
          .trim();
        
        // Create CSV row - ALL fields wrapped in quotes for consistency
        const csvRow = [
          index + 1, // Sr No (no quotes needed for numbers)
          `"${productCode}"`,
          `"${productName}"`,
          `"${categoryName}"`,
          `"${subCategoryName}"`,
          quantity, // Quantity (no quotes needed for numbers)
          `"${cleanSizes}"`,
          `"${imageUrl}"`
        ].join(',');
        
        console.log(`   - CSV Row: ${csvRow.substring(0, 150)}...`);
        
        csvContent += csvRow + '\n';
        
        console.log(`   ✅ Product ${index + 1} SUCCESSFULLY ADDED TO CSV`);
      });
      
      console.log(`🎯 FINAL RESULT: ${productsWithDetails.length} product rows added to CSV`);
    }

    // Summary Section
    csvContent += `\n`;
    csvContent += `ORDER SUMMARY\n`;
    const finalTotalQuantity = productsWithDetails.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    csvContent += `Total Products,${productsWithDetails.length}\n`;
    csvContent += `Total Quantity,${finalTotalQuantity}\n`;
    csvContent += `\n`;

    // Footer
    csvContent += `REPORT GENERATED BY RATOOMAL ADMIN PANEL\n`;
    csvContent += `Contact: ${process.env.ADMIN_EMAIL || 'admin@ratoomal.com'}\n`;
    csvContent += `Website: https://ratoomal.com\n`;

    console.log(`🎯 CSV GENERATION COMPLETED SUCCESSFULLY`);
    console.log(`📊 FINAL STATISTICS:`);
    console.log(`   - Total content length: ${csvContent.length} characters`);
    console.log(`   - Products included in CSV: ${productsWithDetails.length}`);
    
    // Count actual product rows in CSV content
    const productRowsInCSV = (csvContent.match(/^\d+,/gm) || []).length;
    console.log(`   - Product rows in CSV: ${productRowsInCSV}`);
    
    // Final verification
    if (productRowsInCSV !== productsWithDetails.length) {
      console.error(`🚨 CRITICAL ERROR: CSV rows (${productRowsInCSV}) don't match products (${productsWithDetails.length})`);
    }
    
    console.log(`📄 CSV content preview (first 500 chars):\n${csvContent.substring(0, 500)}`);

    // Create filename with better format and safety
    const companyName = inquiry.user?.companyName
      ? inquiry.user.companyName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 30)
      : 'Unknown_Company';
    const dateStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
    const filename = `Ratoomal_Inquiry_${companyName}_${dateStr}_${timeStr}.csv`;

    console.log(`Returning CSV file: ${filename}`);

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Error generating CSV report:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate CSV report'
    }, { status: 500 });
  }
}

// UPDATE INQUIRY STATUS (Admin)
export async function PUT(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { inquiryId, status, adminNotes } = body;

    if (!inquiryId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Inquiry ID and status are required'
      }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'responded', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid status'
      }, { status: 400 });
    }

    const updateData = {
      status,
      ...(adminNotes && { adminNotes }),
      ...(status === 'responded' && { respondedAt: new Date() })
    };

    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      updateData,
      { new: true }
    ).populate('user', '-password');

    if (!inquiry) {
      return NextResponse.json({
        success: false,
        error: 'Inquiry not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: inquiry,
      message: 'Inquiry status updated successfully'
    });

  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update inquiry status'
    }, { status: 500 });
  }
}