# Email Approval Debugging Guide

## 🔍 Issue: User Email Not Receiving Approval

### Improvements Made:

#### 1. **Better Error Handling in Routes**
- ✅ Added try-catch blocks in inquiry and custom-orders PATCH/PUT endpoints
- ✅ Added detailed console logs with emojis for easy tracking
- ✅ Check if email field exists before sending
- ✅ Return status even if email fails (don't block the response)

#### 2. **Enhanced Mailer (lib/mailer.js)**
- ✅ Validate email configuration from environment variables
- ✅ Validate recipient email format
- ✅ Log success/failure with message ID
- ✅ Throw clear error messages

#### 3. **Console Logs to Check**

```
📝 Updating inquiry: [id] Status: approved
✅ Inquiry updated. Email: user@example.com
📧 SENDING INQUIRY APPROVED MAIL TO: user@example.com
Subject: Your Product Inquiry Has Been Approved ✅
📧 Attempting to send email to: user@example.com
✅ Email sent successfully: { messageId: '...', to: '...', subject: '...' }
✅ INQUIRY APPROVED MAIL SENT SUCCESSFULLY
```

---

## 🔧 Debugging Steps:

### Step 1: Check Browser Console & Network Tab
```
- Open admin panel in browser
- Open DevTools (F12)
- Go to Network tab
- Approve an inquiry
- Look at the PATCH request response
- Check if it has "emailError" key
```

### Step 2: Check Server Logs
```
Terminal should show:
📝 Updating inquiry: ...
✅ Inquiry updated. Email: ...
📧 SENDING INQUIRY APPROVED MAIL TO: ...
✅ Email sent successfully: { messageId: '...', ... }
```

### Step 3: Check Environment Variables
```
Verify in .env.local:
- EMAIL_HOST=smtp.gmail.com (or your email service)
- EMAIL_PORT=587
- EMAIL_USER=your-email@gmail.com
- EMAIL_PASS=your-app-password
- ADMIN_EMAIL=admin@example.com
```

### Step 4: Test Email Configuration
```javascript
// Temporarily add this to test email sending:
// Create a test file: app/api/test-email/route.js

import { sendEmail } from "@/lib/mailer";

export async function GET() {
  try {
    await sendEmail({
      to: "test@example.com",
      subject: "Test Email",
      html: "<h1>Test Email</h1>"
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 📊 Common Issues & Solutions:

| Issue | Cause | Solution |
|-------|-------|----------|
| Email not sent but no error | Missing email in inquiry | Check if `updated.email` exists in DB |
| `ECONNREFUSED` error | SMTP server not reachable | Check EMAIL_HOST and EMAIL_PORT |
| `Invalid login` error | Wrong credentials | Verify EMAIL_USER and EMAIL_PASS |
| Email goes to spam | Missing headers | Email template is already properly formatted |
| Empty recipient field | `updated.email` is undefined | Ensure inquiry has email field populated |

---

## 🧪 How to Test Approval Email:

1. **Create an inquiry** from the public form
2. **Check server logs** - should see "SENDING NEW INQUIRY NOTIFICATION TO ADMIN"
3. **Go to admin panel** → Inquiries
4. **Click to approve** the inquiry
5. **Check server logs** - should see:
   ```
   📝 Updating inquiry: ...
   📧 SENDING INQUIRY APPROVED MAIL TO: ...
   ✅ Email sent successfully: { messageId: '...' }
   ```
6. **Check email account** - should receive approval email within 2-3 minutes

---

## 🚀 If Still Not Working:

1. Check `.env.local` - ensure all EMAIL_* variables are set
2. Verify email service credentials are correct
3. Check if firewall is blocking port 587
4. Try using a test email service like Mailtrap for debugging
5. Check browser network tab for response errors
6. Review server console for stack traces

---

## 📧 Email Flow:

```
User submits inquiry → Admin notified → Admin approves → User receives email
                                          ↓
                                    Status updated
                                    Email sending triggered
                                    ↓
                              Check if email exists
                              Get template
                              Send via nodemailer
                              Log success/error
```

---

## ✅ Files Modified:

1. `app/api/admin/inquiry/[id]/route.js` - Added error handling
2. `app/api/admin/custom-orders/[id]/route.js` - Added error handling
3. `lib/mailer.js` - Enhanced with validation and logging
4. `lib/emailTemplates.js` - Added templates for approvals

---

**Last Updated:** January 20, 2026
