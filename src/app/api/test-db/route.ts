import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export const maxDuration = 30;

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Environment variables kontrolü
    const envCheck = {
      DB_HOST: process.env.DB_HOST || 'NOT SET (using fallback)',
      DB_PORT: process.env.DB_PORT || 'NOT SET (using fallback)',
      DB_USER: process.env.DB_USER || 'NOT SET (using fallback)',
      DB_NAME: process.env.DB_NAME || 'NOT SET (using fallback)',
      DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET (using fallback)',
    };
    
    console.log('🔍 Environment variables:', envCheck);
    
    // Database bağlantı testi
    const isConnected = await testConnection();
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      connected: isConnected,
      duration: `${duration}ms`,
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      duration: `${duration}ms`,
      environment: {
        DB_HOST: process.env.DB_HOST || 'NOT SET',
        DB_PORT: process.env.DB_PORT || 'NOT SET',
        DB_USER: process.env.DB_USER || 'NOT SET',
        DB_NAME: process.env.DB_NAME || 'NOT SET',
        DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

