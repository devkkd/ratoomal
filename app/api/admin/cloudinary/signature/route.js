import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request) {
  try {
    // Get Cloudinary credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    console.log('🔑 Cloudinary Config:', {
      cloudName,
      apiKey: apiKey ? '***SET***' : 'NOT SET',
      apiSecret: apiSecret ? '***SET***' : 'NOT SET'
    });

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { 
          error: 'Cloudinary credentials missing',
          details: 'Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local'
        },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    
    // IMPORTANT: For folder-based uploads, we need to generate signature 
    // without folder parameter when getting initial signature
    // The actual folder will be added during upload
    
    const paramsToSign = {
      timestamp: timestamp
      // Note: folder parameter is NOT included in initial signature
      // It will be added during upload with the specific folder path
    };

    // Sort parameters alphabetically (required by Cloudinary)
    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map(key => `${key}=${paramsToSign[key]}`)
      .join('&');

    console.log('📝 String to sign:', sortedParams);
    console.log('🔑 API Secret:', apiSecret ? '***SET***' : 'NOT SET');

    const signatureString = sortedParams + apiSecret;
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex');

    console.log('✅ Generated signature:', signature);

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      // Don't include folder in initial response
      // folder: 'products' // Removed
    });

  } catch (error) {
    console.error('❌ Cloudinary signature error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate signature',
        message: error.message
      },
      { status: 500 }
    );
  }
}