import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPrivyToken } from '@privy-io/server-auth';

// Define the environment variables types for TypeScript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRIVY_APP_SECRET: string;
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    // Require authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    
    // Verify the token using Privy server-side verification
    const verifiedClaims = await verifyPrivyToken({
      token,
      appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
      appSecret: process.env.PRIVY_APP_SECRET,
    });
    
    // If verification succeeds, return user data
    return res.status(200).json({
      authenticated: true,
      userId: verifiedClaims.userId,
      walletAddress: verifiedClaims.wallet?.address,
      email: verifiedClaims.email?.address,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      message: 'Unauthorized: Invalid token',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}
