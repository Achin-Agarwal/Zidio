import { verifyToken } from '../utils/jwtFunct.js';
import config from '../config/config.js';

export default function checkAuth(requiredRole) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];

      // Check for Bearer token
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.error?.(401, 'Missing or malformed token', 'UNAUTHORIZED');
      }

      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);

      // Check token validity and role
      if (!payload || !['user', 'admin'].includes(payload.role)) {
        return res.error?.(401, 'Invalid or expired token', 'UNAUTHORIZED');
      }

      // Check role access
      if (
        requiredRole &&
        payload.role !== requiredRole &&
        !(requiredRole === 'user' && payload.role === 'admin') // Admin can act as user
      ) {
        return res.error?.(403, 'Unauthorized access', 'FORBIDDEN');
      }

      req.user = payload;
      next();
    } catch (err) {
      return res.error?.(500, 'Authentication failed', 'INTERNAL_ERROR');
    }
  };
}
