# Render Environment Variables Setup

## Required Environment Variables for Render:

### 1. Database
```
MONGODB_URI=mongodb+srv://developmentkontentkraftdigital_db_user:kkd11001@cluster0.7tebl0z.mongodb.net/?appName=Cluster0
```

### 2. Base URL (IMPORTANT - Set this to your Render URL)
```
NEXT_PUBLIC_API_BASE_URL=https://ratoomal.onrender.com
```

### 3. JWT Secret
```
JWT_SECRET=sk_9f8s7d6f7sd8f7sd8f7sd8f7sdf
```

### 4. Email Configuration
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mehravivek2001@gmail.com
EMAIL_PASS=awpn oqjj crql kesa
ADMIN_EMAIL=developmentkontentkraftdigital@gmail.com
```

### 5. Cloudflare R2 Storage
```
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://your-custom-domain.com
```

### 6. Node Environment
```
NODE_ENV=production
```

## How to Set in Render:

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add each variable above
5. **MOST IMPORTANT**: Set `NEXT_PUBLIC_API_BASE_URL` to your actual Render URL

## Port Configuration:

Render automatically sets the PORT environment variable. Next.js will use it automatically.
No need to set PORT manually in Render.

## Build Command:
```
npm run build
```

## Start Command:
```
npm start
```