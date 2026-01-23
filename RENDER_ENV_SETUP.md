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

### 5. Cloudinary
```
CLOUDINARY_CLOUD_NAME=dngufsprp
CLOUDINARY_API_KEY=271446737326545
CLOUDINARY_API_SECRET=3yqkhHzIeH7U17D6iX_Pqd5Xzqo
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