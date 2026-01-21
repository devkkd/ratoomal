import jwt from 'jsonwebtoken';

/**
 * Verify any token (user or admin)
 * @param {string} token - JWT token
 * @returns {object} Decoded token data or null if invalid
 */
export function verifyToken(token) {
  try {
    if (!token) {
      console.log('❌ No token provided');
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully, role:', decoded.role);
    return decoded;
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return null;
  }
}

/**
 * Verify admin token
 * @param {string} token - JWT token
 * @returns {object} Decoded token data or null if invalid
 */
export function verifyAdminToken(token) {
  try {
    if (!token) {
      console.log('❌ No token provided for admin check');
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified, checking role:', decoded.role);

    // Check if token has admin role (updated to work with current token structure)
    if (decoded.role !== 'admin') {
      console.log('❌ Token role is not admin, got:', decoded.role);
      return null;
    }

    console.log('✅ Admin token verified successfully');
    return decoded;
  } catch (error) {
    console.error('❌ Admin token verification failed:', error.message);
    return null;
  }
}

/**
 * Get token from request (cookie or header)
 * @param {Request} req - Next.js request object
 * @returns {string} Token or null
 */
export function getAdminTokenFromRequest(req) {
  try {
    // Try to get from adminToken cookie first (httpOnly)
    const adminCookieToken = req.cookies?.get('adminToken')?.value;
    if (adminCookieToken) {
      console.log('✅ Admin token found in adminToken cookie');
      return adminCookieToken;
    }

    // Try to get from token cookie (for backward compatibility)
    const cookieToken = req.cookies?.get('token')?.value;
    if (cookieToken) {
      console.log('✅ Token found in token cookie');
      return cookieToken;
    }

    console.log('📋 Available cookies:', Array.from(req.cookies || []).map(([k]) => k));

    // Try to get from Authorization header
    const authHeader = req.headers?.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      console.log('✅ Token found in Authorization header');
      return authHeader.slice(7);
    }

    console.log('❌ No token found in cookies or headers');
    return null;
  } catch (error) {
    console.error('❌ Error getting token from request:', error);
    return null;
  }
}

/**
 * Middleware to protect admin API routes
 * Usage: await adminAuthMiddleware(req)
 * @param {Request} req - Next.js request object
 * @returns {object} { isAuthorized: boolean, decoded: object|null, error: string|null }
 */
export function adminAuthMiddleware(req) {
  try {
    const token = getAdminTokenFromRequest(req);

    if (!token) {
      return {
        isAuthorized: false,
        decoded: null,
        error: 'No token provided',
      };
    }

    const decoded = verifyAdminToken(token);

    if (!decoded) {
      return {
        isAuthorized: false,
        decoded: null,
        error: 'Invalid or expired token',
      };
    }

    return {
      isAuthorized: true,
      decoded: decoded,
      error: null,
    };
  } catch (error) {
    return {
      isAuthorized: false,
      decoded: null,
      error: error.message,
    };
  }
}
