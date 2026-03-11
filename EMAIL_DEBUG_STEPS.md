# Email Not Sending - Debug Steps

## Current Status
✅ Email configuration is correct (tested successfully)
✅ SMTP connection works
✅ Code has been updated with user confirmation email
⚠️ Need to test inquiry submission

## Steps to Fix and Test

### Step 1: Restart Dev Server
Your dev server is already running on port 3000. You need to restart it to load the new code:

```bash
# Stop the current dev server (Ctrl + C in the terminal where it's running)
# Then start it again:
cd ratoomal
npm run dev
```

### Step 2: Clear Browser Cache
```
Press Ctrl + Shift + R to hard refresh the page
Or clear browser cache completely
```

### Step 3: Test Inquiry Submission

1. **Login to the application**:
   - Go to: http://localhost:3000/login
   - Login with a test user account

2. **Add products to inquiry cart**:
   - Browse products
   - Click "Add to Inquiry Cart" on products
   - Go to: http://localhost:3000/inquiry-cart

3. **Submit inquiry**:
   - Fill out the form:
     - Select "Inquiry For" (e.g., Bulk Order)
     - Select "Customization Needed" (e.g., Finish/Color)
     - Enter message
   - Click "Submit Inquiry"

### Step 4: Check Server Logs

Watch the terminal where dev server is running. You should see:

```
✅ Inquiry created successfully: [inquiry_id]
📧 User email for confirmation: [user_email]
📧 Admin email for notification: webratoomals@gmail.com
📧 SENDING CART INQUIRY NOTIFICATION TO ADMIN
✅ CART INQUIRY ADMIN NOTIFICATION SENT
📧 PREPARING USER CONFIRMATION EMAIL
📧 Recipient: [user_email]
SENDING CONFIRMATION EMAIL TO USER: [user_email]
✅ USER CONFIRMATION EMAIL SENT SUCCESSFULLY
```

If you see error messages:
```
❌ USER CONFIRMATION EMAIL SEND FAILED: [error message]
```

### Step 5: Check Email Inbox

1. **Check Admin Email** (webratoomals@gmail.com):
   - Should receive: "New Cart Inquiry from [Company Name]"

2. **Check User Email** (the email of logged-in user):
   - Should receive: "Your Inquiry is Being Processed - Ratoomal"
   - Check spam folder if not in inbox

## Common Issues and Solutions

### Issue 1: Email Not Sending
**Solution**: 
- Restart dev server (Step 1)
- Check server logs for error messages
- Verify user email is correct in their account

### Issue 2: Email Going to Spam
**Solution**:
- Check spam folder
- Mark as "Not Spam"
- Add sender to contacts

### Issue 3: Wrong User Email
**Solution**:
- Check user's account settings
- Verify businessEmail field is correct
- Update user email in database if needed

### Issue 4: Server Logs Show Error
**Possible Errors**:

1. **"Invalid recipient email"**
   - User's email in database is invalid
   - Check User model for correct email

2. **"Authentication failed"**
   - Email password is wrong
   - Regenerate Gmail App Password

3. **"Connection timeout"**
   - Network issue
   - Check internet connection
   - Try again

## Quick Test Command

Run this to test email system:
```bash
cd ratoomal
node scripts/testEmail.js
```

Should output:
```
✅ SMTP connection verified!
✅ Test email sent successfully!
✅ Email system is working correctly!
```

## What Was Changed

### File: `ratoomal/app/api/admin/inquiry/route.js`

Added user confirmation email after admin notification:

```javascript
// Send confirmation email to user
try {
  console.log("📧 PREPARING USER CONFIRMATION EMAIL");
  console.log("📧 Recipient:", user.businessEmail);
  
  const userEmailSubject = `Your Inquiry is Being Processed - Ratoomal`;
  const userEmailHtml = `
    // Beautiful HTML email template
  `;

  await sendEmail({
    to: user.businessEmail,
    subject: userEmailSubject,
    html: userEmailHtml,
  });

  console.log("✅ USER CONFIRMATION EMAIL SENT SUCCESSFULLY");
} catch (err) {
  console.error("❌ USER CONFIRMATION EMAIL SEND FAILED:", err.message);
}
```

## Verification Checklist

- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] Logged in with valid user account
- [ ] Products added to inquiry cart
- [ ] Inquiry form filled and submitted
- [ ] Server logs checked for email sending messages
- [ ] Admin email received
- [ ] User email received (check spam folder too)

## If Still Not Working

1. **Check server logs** - Look for the exact error message
2. **Verify user email** - Make sure user's businessEmail is valid
3. **Test email system** - Run `node scripts/testEmail.js`
4. **Check .env.local** - Verify all email variables are set
5. **Try different user** - Test with another user account

## Contact for Help

If emails still not sending after following all steps:
1. Share the server logs (terminal output)
2. Share any error messages
3. Confirm which step is failing

---

**Last Updated**: March 2, 2026
**Status**: Ready for Testing
