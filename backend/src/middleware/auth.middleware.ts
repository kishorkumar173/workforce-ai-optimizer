import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';
import { db } from '../repositories/db';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Flexible authentication middleware supporting Bearer JWT/token or Demo role/user headers.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  // 1. Check for Bearer token
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      if (parsed && parsed.id && parsed.role) {
        req.user = {
          id: parsed.id,
          email: parsed.email || '',
          role: parsed.role,
          fullName: parsed.full_name || parsed.fullName || '',
        };
        return next();
      }
    } catch {
      // ignore
    }
  }

  // 2. Check for client-provided role/user headers
  const demoUserId = req.headers['x-user-id'] as string;
  const demoRole = (req.headers['x-user-role'] as string)?.toUpperCase() as UserRole;
  const demoEmail = req.headers['x-user-email'] as string;
  const demoName = req.headers['x-user-name'] as string;

  if (demoUserId || demoRole) {
    const profile = demoUserId ? db.profiles.find((p) => p.id === demoUserId) : null;
    req.user = {
      id: demoUserId || (profile ? profile.id : 'prof-1'),
      email: demoEmail || (profile ? profile.email : 'sarah.johnson@teampulse.ai'),
      role: (demoRole && ['ADMIN', 'EMPLOYER', 'EMPLOYEE'].includes(demoRole))
        ? demoRole
        : (profile ? profile.role : 'EMPLOYER'),
      fullName: demoName || (profile ? profile.full_name : 'Sarah Johnson'),
    };
    return next();
  }

  // Fallback default authorized user for seamless out-of-the-box local testing
  req.user = {
    id: 'prof-1',
    email: 'sarah.johnson@teampulse.ai',
    role: 'EMPLOYER',
    fullName: 'Sarah Johnson',
  };
  next();
};

/**
 * Role-based authorization guard
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized: Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden: Operation requires one of the following roles: ${allowedRoles.join(', ')}`,
        currentRole: req.user.role,
      });
      return;
    }

    next();
  };
};
