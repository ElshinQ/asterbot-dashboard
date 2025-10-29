import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/queries';
import { testConnection } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Check if required environment variables are set
    const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return NextResponse.json(
        { 
          error: 'Configuration Error', 
          details: `Missing environment variables: ${missingVars.join(', ')}`,
          message: 'Please configure database environment variables in Vercel dashboard'
        },
        { status: 500 }
      );
    }

    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { 
          error: 'Database Connection Failed',
          details: 'Could not connect to PostgreSQL database',
          message: 'Check database credentials and network access'
        },
        { status: 500 }
      );
    }

    // Fetch all dashboard statistics
    const stats = await getDashboardStats();

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
        message: 'Internal server error occurred'
      },
      { status: 500 }
    );
  }
}

