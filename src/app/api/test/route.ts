import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true, message: 'API is working' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      success: true, 
      message: 'POST request received successfully', 
      data: body 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Error processing request', 
      error: String(error) 
    }, { status: 400 });
  }
} 