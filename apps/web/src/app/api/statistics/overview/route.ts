import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'artisthub-dev-secret-key-2024';

// Mock analytics data
const mockAnalytics = {
  totalRevenue: 125430,
  totalStreams: 8450000,
  totalArtists: 12,
  growthRate: 15.2,
  monthlyData: [
    { month: 'Jan', revenue: 12500, streams: 850000 },
    { month: 'Feb', revenue: 14200, streams: 920000 },
    { month: 'Mar', revenue: 13800, streams: 880000 },
    { month: 'Apr', revenue: 15600, streams: 1100000 },
    { month: 'May', revenue: 17200, streams: 1200000 },
    { month: 'Jun', revenue: 16800, streams: 1150000 }
  ],
  topArtists: [
    { name: 'Luna Rivera', revenue: 35000, streams: 2840000 },
    { name: 'Echo Collective', revenue: 28000, streams: 1920000 },
    { name: 'Midnight Serenade', revenue: 18000, streams: 890000 }
  ],
  revenueBySource: {
    streaming: 65000,
    concerts: 35000,
    merchandise: 15000,
    licensing: 10430
  }
};

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
      data: mockAnalytics
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}