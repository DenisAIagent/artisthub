import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'artisthub-dev-secret-key-2024';

// Mock artists data
const mockArtists = [
  {
    id: 1,
    name: 'Luna Rivera',
    genre: 'Indie Pop',
    status: 'active',
    monthlyListeners: 125420,
    totalStreams: 2840000,
    lastActivity: '2024-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna'
  },
  {
    id: 2,
    name: 'Echo Collective',
    genre: 'Electronic',
    status: 'active',
    monthlyListeners: 89350,
    totalStreams: 1920000,
    lastActivity: '2024-01-12',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Echo'
  },
  {
    id: 3,
    name: 'Midnight Serenade',
    genre: 'Jazz Fusion',
    status: 'inactive',
    monthlyListeners: 45680,
    totalStreams: 890000,
    lastActivity: '2023-12-28',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight'
  }
];

function authenticateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return null;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return user;
  } catch (err) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Access token required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: mockArtists
    });
  } catch (error) {
    console.error('Artists API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}