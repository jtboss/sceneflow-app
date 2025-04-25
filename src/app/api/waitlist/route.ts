import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key
const resend = new Resend('re_PJDpHkQU_EGm3pfANAizN9LtNuhDAXo1q');

// In development mode, Resend only allows sending to the API key owner's email
const isDevelopment = process.env.NODE_ENV !== 'production';
const adminEmail = 'hey.jjedwards@gmail.com';

export async function POST(request: Request) {
  console.log('Waitlist API route called', new Date().toISOString());
  
  try {
    // Parse the request body
    const body = await request.json();
    const { email } = body;
    
    console.log('Received email:', email);

    // Validate email
    if (!email || typeof email !== 'string') {
      console.error('Invalid email format received:', email);
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    try {
      // In development, we send all emails to the admin email with information about the intended recipient
      // In production, we would send to the actual user email
      
      // Send confirmation email
      console.log('Sending confirmation email...');
      
      const userEmailResult = await resend.emails.send({
        from: 'SceneFlow <onboarding@resend.dev>',
        // In development, always send to admin
        to: adminEmail, 
        subject: isDevelopment 
          ? `[TEST] Welcome to SceneFlow Waitlist (intended for: ${email})` 
          : 'Welcome to SceneFlow Waitlist!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            ${isDevelopment ? `
            <div style="background-color: #f8d7da; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
              <p style="color: #721c24; margin: 0;">
                <strong>DEVELOPMENT MODE:</strong> This email is intended for ${email}, but is being sent to you because Resend requires domain verification to send to other addresses.
              </p>
            </div>
            ` : ''}
            <h1 style="color: #2A2E45; margin-top: 30px;">Welcome to SceneFlow!</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Thank you for joining our waitlist! We're excited to have you on board as we build SceneFlow - 
              the AI-powered platform helping creators visually plan their content with shotlists, AI suggestions, and moodboards.
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              We'll notify you as soon as we launch and you'll be among the first to get access.
            </p>
            <div style="margin: 40px 0; padding: 20px; background-color: #F5EBDD; border-radius: 8px;">
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #C86C5B;">
                Stay tuned for updates on our progress!
              </p>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 40px;">
              The SceneFlow Team
            </p>
          </div>
        `,
      });
      console.log('Confirmation email result:', userEmailResult);

      // Send notification email to admin about the new signup
      // Only send a separate notification email if we're in production
      // (otherwise the admin already got the welcome email)
      if (!isDevelopment) {
        console.log('Sending notification email to admin');
        const adminEmailResult = await resend.emails.send({
          from: 'SceneFlow <onboarding@resend.dev>',
          to: adminEmail,
          subject: 'New SceneFlow Waitlist Signup',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2A2E45;">New Waitlist Signup</h2>
              <p style="font-size: 16px; line-height: 1.5; color: #333;">
                A new user has joined the SceneFlow waitlist.
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #333;">
                Email: ${email}
              </p>
              <p style="font-size: 12px; color: #888; margin-top: 20px;">
                Timestamp: ${new Date().toISOString()}
              </p>
            </div>
          `,
        });
        console.log('Admin email result:', adminEmailResult);
      }
      
    } catch (emailError: any) {
      console.error('Error sending email:', emailError);
      if (emailError.statusCode) {
        console.error('Resend API error status code:', emailError.statusCode);
      }
      if (emailError.message) {
        console.error('Resend API error message:', emailError.message);
      }
      
      // Don't throw - we want to return a success to the user even if email fails
    }

    // Return success response
    console.log('Waitlist submission successful');
    return NextResponse.json(
      { success: true, message: 'Successfully joined the waitlist' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to join waitlist', 
        error: String(error.message || error) 
      },
      { status: 500 }
    );
  }
} 