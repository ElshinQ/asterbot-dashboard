import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/queries';
import { testConnection } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Get database parameter from URL
    const { searchParams } = new URL(request.url);
    const database = searchParams.get('database') || 'ichigo';
    
    // Validate database parameter
    if (database !== 'ichigo' && database !== 'asterdex') {
      return NextResponse.json(
        { 
          error: 'Invalid Database', 
          details: `Database must be either 'ichigo' or 'asterdex'`,
          message: 'Invalid database selection'
        },
        { status: 400 }
      );
    }

    // Check if required environment variables are set
    const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD'];
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

    // Test database connection for the selected database
    const isConnected = await testConnection(database);
    if (!isConnected) {
      return NextResponse.json(
        { 
          error: 'Database Connection Failed',
          details: `Could not connect to ${database} PostgreSQL database`,
          message: 'Check database credentials and network access'
        },
        { status: 500 }
      );
    }

    // Fetch all dashboard statistics from selected database
    const stats = await getDashboardStats(database);

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

