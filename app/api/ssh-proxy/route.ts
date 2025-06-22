import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    const VPS_SSH_SERVER_URL = process.env.VPS_SSH_SERVER_URL;

    switch (action) {
      case 'get_connection_info':
        if (!VPS_SSH_SERVER_URL) {
          return NextResponse.json({
            success: false,
            error: 'VPS_SSH_SERVER_URL environment variable not set'
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          websocketUrl: VPS_SSH_SERVER_URL
        });

      case 'health_check':
        return NextResponse.json({
          success: true,
          status: 'available',
          url: VPS_SSH_SERVER_URL
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('SSH Proxy error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'SSH proxy running',
    timestamp: new Date().toISOString()
  });
} 