import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'artisthub-dev-secret-key-2024';

// Simple in-memory user storage for authentication
const users = [
  {
    id: 1,
    email: 'demo@artisthub.com',
    password: '$2a$10$xE6fiaP5VOBoVigzQD0I6.iQr/lNQfYcKA71yZxgsS4rzTJTxuYTa', // password: 'demo123'
    name: 'Démo Artist',
    role: 'artist',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'manager@artisthub.com',
    password: '$2a$10$xE6fiaP5VOBoVigzQD0I6.iQr/lNQfYcKA71yZxgsS4rzTJTxuYTa', // password: 'demo123'
    name: 'Démo Manager',
    role: 'manager',
    createdAt: new Date().toISOString()
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}