import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { sendEmail } from '@/lib/mailer';
import bcrypt from 'bcryptjs';
import {
  userApprovedTemplate,
  userRejectedTemplate,
} from '@/lib/emailTemplates';

// Function to generate temporary password
function generateTempPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// GET single customer
export async function GET(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    const customer = await User.findById(id).select('-password');

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: customer });

  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE customer status
export async function PATCH(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    const { status, rejectionReason, password } = await request.json();

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updateData = { status };
    if (status === 'rejected') {
      updateData.rejectionReason = rejectionReason || '';
    }

    // If approving, validate password is provided
    if (status === 'approved' && !password) {
      return NextResponse.json(
        { success: false, error: 'Password is required to approve customer' },
        { status: 400 }
      );
    }

    const customer = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Send email notification when status changes
    if (status === 'approved' || status === 'rejected') {
      try {
        if (!customer.businessEmail) {
          console.error('⚠️ EMAIL MISSING - Cannot send email without recipient');
          return NextResponse.json({
            success: true,
            message: `Customer ${status} successfully`,
            data: customer,
            warning: 'Email not sent - customer email missing',
          });
        }

        let tempPassword = null;
        let customerForEmail = { ...customer.toObject() };

        // Set password for approved accounts (admin provided password)
        if (status === 'approved') {
          tempPassword = password; // Use admin-provided password
          const hashedPassword = await bcrypt.hash(tempPassword, 10);
          
          await User.findByIdAndUpdate(id, { password: hashedPassword });
          console.log('🔐 PASSWORD SET FOR APPROVED CUSTOMER:', customer.businessEmail);
        }

        const email = status === 'approved' 
          ? userApprovedTemplate(customerForEmail, tempPassword)
          : userRejectedTemplate();

        console.log(`📧 SENDING CUSTOMER ${status.toUpperCase()} EMAIL TO:`, customer.businessEmail);
        console.log('Subject:', email.subject);

        await sendEmail({
          to: customer.businessEmail,
          subject: email.subject,
          html: email.html,
        });

        console.log(`✅ CUSTOMER ${status.toUpperCase()} EMAIL SENT SUCCESSFULLY`);
      } catch (emailErr) {
        console.error("❌ CUSTOMER EMAIL SEND ERROR:", {
          error: emailErr.message,
          stack: emailErr.stack,
          email: customer.email,
        });

        // Still return success but log the email error
        return NextResponse.json({
          success: true,
          message: `Customer ${status} successfully`,
          data: customer,
          emailError: emailErr.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Customer ${status} successfully`,
      data: customer,
    });

  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
