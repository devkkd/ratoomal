import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { sendEmail } from "@/lib/mailer";

// CREATE CONTACT INQUIRY
export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const {
      companyName,
      contactPersonName,
      businessEmail,
      country,
      phone,
      inquiryType,
      productCategory,
      estimatedQuantity,
      customizationRequired,
      message,
      source = 'contact_page',
      referenceFiles = []
    } = body;

    console.log('Received contact inquiry:', { companyName, businessEmail, inquiryType });

    // Validate required fields
    if (!companyName || !contactPersonName || !businessEmail || !country || !phone || 
        !inquiryType || !productCategory || !estimatedQuantity || !customizationRequired || !message) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      return NextResponse.json({
        success: false,
        error: 'Please provide a valid email address'
      }, { status: 400 });
    }

    // Create contact inquiry
    const contactData = {
      companyName: companyName.trim(),
      contactPersonName: contactPersonName.trim(),
      businessEmail: businessEmail.trim().toLowerCase(),
      country: country.trim(),
      phone: phone.trim(),
      inquiryType,
      productCategory,
      estimatedQuantity,
      customizationRequired,
      message: message.trim(),
      source,
      referenceFiles: referenceFiles || []
    };

    const contact = await Contact.create(contactData);
    
    console.log("Contact inquiry created successfully:", contact._id);

    // Send email to admin
    try {
      const emailSubject = `New ${source === 'home_page_bulk_section' ? 'Bulk Solutions' : 'Contact'} Inquiry from ${companyName}`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #C18E4D; margin-bottom: 20px; text-align: center;">
              New ${source === 'home_page_bulk_section' ? 'Custom & Bulk Solutions' : 'Contact'} Inquiry
            </h2>
            
            <div style="background-color: #FFF6EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">Business Information</h3>
              <p><strong>Company Name:</strong> ${companyName}</p>
              <p><strong>Contact Person:</strong> ${contactPersonName}</p>
              <p><strong>Business Email:</strong> ${businessEmail}</p>
              <p><strong>Phone/WhatsApp:</strong> ${phone}</p>
              <p><strong>Country:</strong> ${country}</p>
            </div>
            
            <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">Inquiry Details</h3>
              <p><strong>Type of Inquiry:</strong> ${inquiryType.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Product Category:</strong> ${productCategory.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Estimated Quantity:</strong> ${estimatedQuantity}</p>
              <p><strong>Customization Required:</strong> ${customizationRequired.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Source:</strong> ${source === 'home_page_bulk_section' ? 'Home Page - Custom & Bulk Solutions' : 'Contact Us Page'}</p>
            </div>
            
            <div style="background-color: #E8F4FD; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">Customer Message</h3>
              <p style="line-height: 1.6; color: #333;">${message}</p>
            </div>
            
            ${referenceFiles && referenceFiles.length > 0 ? `
            <div style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">Reference Files (${referenceFiles.length})</h3>
              ${referenceFiles.map(file => `
                <p style="margin-bottom: 8px;">
                  <strong>📎 ${file.originalName}</strong><br>
                  <a href="${file.url}" target="_blank" style="color: #C18E4D; text-decoration: none;">View File</a>
                </p>
              `).join('')}
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">
                This inquiry was submitted on ${new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p style="color: #C18E4D; font-weight: bold; margin-top: 15px;">
                Please respond within 24-48 hours for best customer experience.
              </p>
            </div>
          </div>
        </div>
      `;

      console.log("SENDING CONTACT INQUIRY NOTIFICATION TO ADMIN");

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: emailSubject,
        html: emailHtml,
      });

      console.log("CONTACT INQUIRY ADMIN NOTIFICATION SENT ✅");
    } catch (err) {
      console.error("CONTACT INQUIRY EMAIL SEND FAILED ❌", err);
      // Don't fail the whole request if email fails
    }

    // Send confirmation email to customer
    try {
      const customerEmailSubject = `Thank you for your inquiry - Ratoomal`;
      const customerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #C18E4D; margin-bottom: 10px;">Thank You for Your Inquiry!</h1>
              <p style="color: #666; font-size: 16px;">We've received your ${source === 'home_page_bulk_section' ? 'bulk solutions' : 'contact'} inquiry and will respond soon.</p>
            </div>
            
            <div style="background-color: #FFF6EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">Your Inquiry Summary</h3>
              <p><strong>Company:</strong> ${companyName}</p>
              <p><strong>Contact Person:</strong> ${contactPersonName}</p>
              <p><strong>Inquiry Type:</strong> ${inquiryType.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Product Category:</strong> ${productCategory.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Estimated Quantity:</strong> ${estimatedQuantity}</p>
            </div>
            
            <div style="background-color: #E8F4FD; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">What Happens Next?</h3>
              <ul style="color: #333; line-height: 1.8;">
                <li>Our design team will review your requirements within 24-48 hours</li>
                <li>We'll prepare a customized proposal based on your needs</li>
                <li>You'll receive detailed product catalogs and pricing information</li>
                <li>We'll schedule a consultation call to discuss your project</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">
                Need immediate assistance? Contact us at:
              </p>
              <p style="color: #C18E4D; font-weight: bold;">
                Email: ${process.env.ADMIN_EMAIL || 'info@ratoomal.com'}
              </p>
              <p style="color: #C18E4D; font-weight: bold;">
                Website: https://ratoomal.com
              </p>
            </div>
          </div>
        </div>
      `;

      await sendEmail({
        to: businessEmail,
        subject: customerEmailSubject,
        html: customerEmailHtml,
      });

      console.log("CUSTOMER CONFIRMATION EMAIL SENT ✅");
    } catch (err) {
      console.error("CUSTOMER CONFIRMATION EMAIL SEND FAILED ❌", err);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: contact._id,
        companyName,
        inquiryType
      },
      message: 'Your inquiry has been submitted successfully! We will respond within 24-48 hours.'
    });

  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to submit inquiry. Please try again.'
    }, { status: 500 });
  }
}

// GET ALL CONTACT INQUIRIES (Admin)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (source && source !== 'all') {
      query.source = source;
    }

    // Get all contact inquiries
    const contacts = await Contact
      .find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: contacts,
    });

  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch contact inquiries'
    }, { status: 500 });
  }
}

// UPDATE CONTACT INQUIRY STATUS (Admin)
export async function PUT(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { contactId, status, adminNotes } = body;

    if (!contactId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Contact ID and status are required'
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

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true }
    );

    if (!contact) {
      return NextResponse.json({
        success: false,
        error: 'Contact inquiry not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: contact,
      message: 'Contact inquiry status updated successfully'
    });

  } catch (error) {
    console.error('Error updating contact inquiry status:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update contact inquiry status'
    }, { status: 500 });
  }
}