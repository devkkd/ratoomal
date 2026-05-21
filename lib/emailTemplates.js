export const adminNewUserTemplate = (user) => ({
  subject: `🆕 New Business Access Request — ${user.companyName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #C18E4D; margin: 0 0 6px;">New Business Access Request</h1>
          <p style="color: #666; font-size: 14px; margin: 0;">A new business has submitted a verification request</p>
        </div>

        <div style="background-color: #FFF6EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #2D2D2D; margin: 0 0 14px;">Business Details</h3>
          <table style="width:100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 5px 0; color:#666; width:40%;">Company Name</td><td style="padding: 5px 0; font-weight:bold;">${user.companyName}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Contact Person</td><td style="padding: 5px 0;">${user.contactName}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Business Email</td><td style="padding: 5px 0;">${user.businessEmail}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Phone / WhatsApp</td><td style="padding: 5px 0;">${user.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Country</td><td style="padding: 5px 0;">${user.country}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Business Type</td><td style="padding: 5px 0;">${user.businessType}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Purpose</td><td style="padding: 5px 0;">${user.purpose}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Verification Proof</td><td style="padding: 5px 0;">${user.verificationProof}</td></tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #C18E4D; font-weight: bold; font-size: 14px;">Please login to the admin panel to approve or reject this request.</p>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">Submitted on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </div>
  `,
});

export const userApprovedTemplate = (user, tempPassword = null) => ({
  subject: "Your Account Has Been Approved 🎉",
  html: `
    <h3>Account Approved</h3>
    <p>Congratulations! Your business account has been approved.</p>
    <p>You can now login to access our B2B portal.</p>
    <br/>
    <h4>Your Login Credentials:</h4>
    <p><b>Email:</b> ${user.businessEmail}</p>
    ${tempPassword ? `<p><b>Temporary Password:</b> <code style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${tempPassword}</code></p>
    <p style="color: #d32f2f; font-size: 12px;"><b>Important:</b> Please change this password after your first login for security.</p>` : `<p><b>Password:</b> Use the password you created during signup</p>`}
    <br/>
    <p>
      <a href="${process.env.NEXT_PUBLIC_API_BASE_URL}/login" style="background-color: #C08237; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Login to Portal
      </a>
    </p>
    <br/>
    <p style="font-size: 12px; color: #666;">If you have any questions, please contact our support team.</p>
  `,
});

export const userRejectedTemplate = () => ({
  subject: "Business Access Request Update",
  html: `
    <h3>Request Rejected</h3>
    <p>Your request was not approved at this time.</p>
  `,
});

// Inquiry Templates
export const adminNewInquiryTemplate = (inquiry) => ({
  subject: `🛒 New Product Inquiry — ${inquiry.companyName || inquiry.contactName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #C18E4D; margin: 0 0 6px;">New Product Inquiry</h1>
          <p style="color: #666; font-size: 14px; margin: 0;">A customer has submitted a product inquiry</p>
        </div>

        <div style="background-color: #FFF6EB; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #2D2D2D; margin: 0 0 14px;">Customer Details</h3>
          <table style="width:100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 5px 0; color:#666; width:40%;">Company Name</td><td style="padding: 5px 0; font-weight:bold;">${inquiry.companyName || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Contact Person</td><td style="padding: 5px 0;">${inquiry.contactName}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Email</td><td style="padding: 5px 0;">${inquiry.email}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Phone / WhatsApp</td><td style="padding: 5px 0;">${inquiry.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Country</td><td style="padding: 5px 0;">${inquiry.country || 'N/A'}</td></tr>
          </table>
        </div>

        <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #2D2D2D; margin: 0 0 14px;">Inquiry Details</h3>
          <table style="width:100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 5px 0; color:#666; width:40%;">Product</td><td style="padding: 5px 0; font-weight:bold;">${inquiry.product?.name || inquiry.product || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Inquiry Type</td><td style="padding: 5px 0;">${inquiry.inquiryType || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Quantity</td><td style="padding: 5px 0;">${inquiry.quantity || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Customization</td><td style="padding: 5px 0;">${inquiry.customization || 'N/A'}</td></tr>
          </table>
        </div>

        ${inquiry.message ? `
        <div style="background-color: #E8F4FD; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #2D2D2D; margin: 0 0 10px;">Message</h3>
          <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0;">${inquiry.message}</p>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #C18E4D; font-weight: bold; font-size: 14px;">Please login to the admin panel to respond.</p>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">Submitted on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </div>
  `,
});

export const inquiryApprovedTemplate = (inquiry) => ({
  subject: "Your Product Inquiry Has Been Approved ✅",
  html: `
    <h3>Inquiry Approved</h3>
    <p>Thank you for your interest in our products.</p>
    <p>We have received your inquiry and our team will contact you shortly with more information.</p>
    <p><b>Your Inquiry Details:</b></p>
    <p><b>Product:</b> ${inquiry.product?.name || 'N/A'}</p>
    <p><b>Quantity:</b> ${inquiry.quantity}</p>
    <p>We appreciate your business!</p>
  `,
});

export const inquiryRejectedTemplate = (inquiry) => ({
  subject: "Inquiry Update",
  html: `
    <h3>Inquiry Status Update</h3>
    <p>Thank you for your inquiry. Unfortunately, we are unable to proceed at this time.</p>
    <p>If you have any questions, please feel free to contact us.</p>
  `,
});

// Custom Order Templates
export const adminNewCustomOrderTemplate = (order) => ({
  subject: `📦 New Custom Order Request — ${order.companyName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #C18E4D; margin: 0 0 6px;">New Custom Order Request</h1>
          <p style="color: #666; font-size: 14px; margin: 0;">A business has submitted a custom & bulk order inquiry</p>
        </div>

        <div style="background-color: #FFF6EB; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #2D2D2D; margin: 0 0 14px;">Business Details</h3>
          <table style="width:100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 5px 0; color:#666; width:40%;">Company Name</td><td style="padding: 5px 0; font-weight:bold;">${order.companyName}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Contact Person</td><td style="padding: 5px 0;">${order.contactPersonName}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Business Email</td><td style="padding: 5px 0;">${order.businessEmail}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Phone / WhatsApp</td><td style="padding: 5px 0;">${order.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Country</td><td style="padding: 5px 0;">${order.country || 'N/A'}</td></tr>
          </table>
        </div>

        <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #2D2D2D; margin: 0 0 14px;">Order Details</h3>
          <table style="width:100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 5px 0; color:#666; width:40%;">Inquiry Type</td><td style="padding: 5px 0; font-weight:bold;">${order.inquiryType || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Product Category</td><td style="padding: 5px 0;">${order.productCategory || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Estimated Quantity</td><td style="padding: 5px 0;">${order.estimatedQuantity || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color:#666;">Customization Required</td><td style="padding: 5px 0;">${order.customizationRequired || 'N/A'}</td></tr>
          </table>
        </div>

        ${order.message ? `
        <div style="background-color: #E8F4FD; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #2D2D2D; margin: 0 0 10px;">Message</h3>
          <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0;">${order.message}</p>
        </div>
        ` : ''}

        ${order.referenceFiles && order.referenceFiles.length > 0 ? `
        <div style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #2D2D2D; margin: 0 0 10px;">Reference Files (${order.referenceFiles.length})</h3>
          ${order.referenceFiles.map(file => `
            <p style="margin: 6px 0; font-size: 14px;">
              📎 <a href="${file}" target="_blank" style="color: #C18E4D; text-decoration: none;">${file}</a>
            </p>
          `).join('')}
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #C18E4D; font-weight: bold; font-size: 14px;">Please login to the admin panel to review and respond.</p>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">Submitted on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </div>
  `,
});

export const customOrderApprovedTemplate = (order) => ({
  subject: "Your Custom Order Has Been Approved ✅",
  html: `
    <h3>Custom Order Approved</h3>
    <p>Thank you for submitting your custom order request.</p>
    <p>We have reviewed your requirements and our team will contact you shortly with a detailed quote and timeline.</p>
    <p><b>Order Summary:</b></p>
    <p><b>Product Category:</b> ${order.productCategory}</p>
    <p><b>Customization:</b> ${order.customizationRequired}</p>
    <p>We look forward to working with you!</p>
  `,
});

export const customOrderRejectedTemplate = (order) => ({
  subject: "Custom Order Status Update",
  html: `
    <h3>Custom Order Status</h3>
    <p>Thank you for your custom order request. Unfortunately, we are unable to fulfill this request at this time.</p>
    <p>If you have any questions, please feel free to contact us directly.</p>
  `,
});
