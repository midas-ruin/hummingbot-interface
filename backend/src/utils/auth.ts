import { PrivyClient } from '@privy-io/server-auth';
import type { AuthTokenClaims } from '@privy-io/server-auth';
import { logger } from './logger';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email?: string;
  walletAddress?: string;
  role: 'user' | 'admin';
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

if (!process.env.PRIVY_API_KEY) {
  throw new Error('PRIVY_API_KEY environment variable is required');
}

const privy = new PrivyClient({
  apiKey: process.env.PRIVY_API_KEY,
  appId: process.env.PRIVY_APP_ID || ''
});

interface PrivyTokenClaims extends AuthTokenClaims {
  sub: string; // Subject (user ID)
  email_verified?: boolean;
  wallet_address?: string;
  email?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, walletAddress: user.walletAddress },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export async function verifyPrivyToken(token: string): Promise<User> {
  try {
    const claims = await privy.verifyAuthToken(token) as PrivyTokenClaims;
    return {
      id: claims.sub,
      email: claims.email_verified ? claims.email : undefined,
      walletAddress: claims.wallet_address,
      role: 'user'
    };
  } catch (error) {
    logger.error('Error verifying Privy token:', error);
    throw new Error('Invalid token');
  }
};

// Export the verifyPrivyToken as verifyToken for backward compatibility
export const verifyToken = verifyPrivyToken;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
