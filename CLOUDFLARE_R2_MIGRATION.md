# Cloudflare R2 Migration Guide

This project has been migrated from Cloudinary to Cloudflare R2 for file storage.

## Setup Instructions

### 1. Create Cloudflare R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to R2 Object Storage
3. Create a new bucket (e.g., `ratoomal-files`)
4. Note down your Account ID

### 2. Create R2 API Token

1. Go to "Manage R2 API tokens"
2. Create a new API token with:
   - Permissions: Object Read & Write
   - Bucket: Your bucket name
3. Save the Access Key ID and Secret Access Key

### 3. Set up Custom Domain (Optional but Recommended)

1. In your R2 bucket settings, go to "Settings" > "Custom Domains"
2. Add your custom domain (e.g., `files.yourdomain.com`)
3. Update your DNS records as instructed

### 4. Update Environment Variables

Replace the old Cloudinary variables with these R2 variables in your `.env.local`:

```env
# Remove these Cloudinary variables:
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=

# Add these Cloudflare R2 variables:
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://your-custom-domain.com
```

### 5. Update Next.js Configuration

Update `next.config.mjs` to allow images from your R2 domain:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-custom-domain.com', // Your R2 custom domain
      port: '',
      pathname: '/**',
    },
  ],
},
```

### 6. Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm uninstall cloudinary
```

## What Changed

### Files Modified:
- `lib/cloudflare-r2.js` - New R2 utility functions
- `package.json` - Updated dependencies
- `next.config.mjs` - Updated image domains
- All API routes that handled file uploads
- Frontend upload components

### Files Removed:
- `lib/cloudinary.js` - Old Cloudinary configuration
- `app/api/admin/cloudinary/signature/route.js` - No longer needed

### Key Differences:

1. **Upload Method**: Direct buffer upload instead of stream upload
2. **URL Structure**: Uses your custom domain instead of Cloudinary URLs
3. **File Management**: Files are stored with timestamp prefixes for uniqueness
4. **No Transformations**: R2 doesn't provide image transformations (use Cloudflare Images if needed)

## Migration Checklist

- [ ] Set up Cloudflare R2 bucket
- [ ] Create API tokens
- [ ] Configure custom domain (optional)
- [ ] Update environment variables
- [ ] Update Next.js config
- [ ] Install new dependencies
- [ ] Test file uploads
- [ ] Update any hardcoded Cloudinary URLs in database (if any)

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your R2 bucket has proper CORS configuration
2. **Access Denied**: Check your API token permissions
3. **Image Not Loading**: Verify your custom domain is properly configured
4. **Upload Fails**: Check file size limits and content types

### CORS Configuration for R2:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Benefits of R2 over Cloudinary

1. **Cost**: Significantly cheaper for storage and bandwidth
2. **No Bandwidth Charges**: Free egress to Cloudflare CDN
3. **S3 Compatible**: Uses standard S3 API
4. **Global Distribution**: Automatically distributed via Cloudflare's network
5. **No Transformation Limits**: No monthly transformation quotas

## Support

If you encounter any issues during migration, check:
1. Environment variables are correctly set
2. R2 bucket permissions are configured
3. Custom domain is properly set up
4. Dependencies are installed correctly