export const adminNewUserTemplate = (user) => ({
  subject: "New Business Access Request",
  html: `
    <h3>New User Request</h3>
    <p><b>Company:</b> ${user.companyName}</p>
    <p><b>Email:</b> ${user.businessEmail}</p>
    <p><b>Contact:</b> ${user.contactName}</p>
    <p>Please login to admin panel to approve/reject.</p>
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
  subject: "New Product Inquiry Received",
  html: `
    <h3>New Product Inquiry</h3>
    <p><b>Product:</b> ${inquiry.product?.name || 'N/A'}</p>
    <p><b>Company:</b> ${inquiry.companyName || 'N/A'}</p>
    <p><b>Contact Name:</b> ${inquiry.contactName}</p>
    <p><b>Email:</b> ${inquiry.email}</p>
    <p><b>Phone:</b> ${inquiry.phone}</p>
    <p><b>Country:</b> ${inquiry.country}</p>
    <p><b>Quantity:</b> ${inquiry.quantity}</p>
    <p><b>Customization:</b> ${inquiry.customization}</p>
    <p><b>Message:</b> ${inquiry.message}</p>
    <p>Please login to admin panel to respond.</p>
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
  subject: "New Custom Order Request Received",
  html: `
    <h3>New Custom Order Request</h3>
    <p><b>Company:</b> ${order.companyName}</p>
    <p><b>Contact Name:</b> ${order.contactPersonName}</p>
    <p><b>Email:</b> ${order.businessEmail}</p>
    <p><b>Phone:</b> ${order.phone}</p>
    <p><b>Country:</b> ${order.country}</p>
    <p><b>Product Category:</b> ${order.productCategory}</p>
    <p><b>Estimated Quantity:</b> ${order.estimatedQuantity}</p>
    <p><b>Customization Required:</b> ${order.customizationRequired}</p>
    <p><b>Inquiry Type:</b> ${order.inquiryType}</p>
    <p><b>Message:</b> ${order.message}</p>
    <p>Please login to admin panel to review and respond.</p>
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
    <p><b>Estimated Quantity:</b> ${order.estimatedQuantity}</p>
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
