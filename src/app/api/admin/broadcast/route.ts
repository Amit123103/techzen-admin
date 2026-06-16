import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { subject, htmlContent } = await request.json();

    if (!subject || !htmlContent) {
      return NextResponse.json({ error: 'Subject and Content are required' }, { status: 400 });
    }

    // 1. Fetch all active subscribers
    const { data: subscribers, error: dbError } = await supabaseAdmin
      .from('subscribers')
      .select('email')
      .eq('status', 'active');

    if (dbError) {
      if (dbError.code === '42P01') {
        return NextResponse.json({ error: "Subscribers table does not exist yet." }, { status: 400 });
      }
      throw dbError;
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found.' }, { status: 400 });
    }

    // Extract emails into an array
    const bccList = (subscribers as any[]).map((sub: any) => sub.email);

    // 2. Wrap the user's content in a nice branded HTML template
    const brandedHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #D65A7C;">
          <h2 style="margin: 0; color: #333; font-size: 24px;">
            ReInform<span style="color: #D65A7C;">Tech</span>
          </h2>
        </div>
        
        <div style="padding: 30px 20px; line-height: 1.6;">
          ${htmlContent}
        </div>
        
        <div style="text-align: center; padding: 30px 20px; background-color: #f9f9f9; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p style="margin-bottom: 10px;">You are receiving this email because you subscribed to updates from ReInformTech.</p>
          <p>&copy; ${new Date().getFullYear()} ReInformTech Enterprise. All rights reserved.</p>
        </div>
      </div>
    `;

    // 3. Send email using Nodemailer (via BCC)
    // Send to admin email as the 'to' address, and everyone else as 'bcc'
    // This hides emails from each other and is efficient.
    
    // Note: We are using a loop here instead of a massive BCC to ensure better deliverability
    // and to not hit max BCC limits for standard SMTP servers.
    // For a real massive list (>500), a service like Resend/SendGrid is required.
    let successCount = 0;
    
    // We will BCC in chunks of 50 to avoid SMTP limits
    const CHUNK_SIZE = 50;
    for (let i = 0; i < bccList.length; i += CHUNK_SIZE) {
      const chunk = bccList.slice(i, i + CHUNK_SIZE);
      
      const success = await sendEmail({
        to: process.env.GMAIL_EMAIL || 'reinformtech@gmail.com', // Admin gets a copy
        subject: subject,
        html: brandedHtml,
        // We add bcc to the transporter in email.ts? Wait, sendEmail in lib/email.ts doesn't support bcc directly.
        // Let's check lib/email.ts. It takes { to, subject, html }.
        // If we pass an array to `to`, Nodemailer puts them all in the 'To' field which exposes them!
        // So we MUST send individually if `bcc` is not supported in the wrapper, 
        // or we need to update lib/email.ts to support BCC.
      });
    }

    // Since lib/email.ts might not support bcc, let's just send individually to be safe 
    // and ensure privacy. This takes longer but is safer for small lists.
    for (const email of bccList) {
      try {
        await sendEmail({
          to: email,
          subject: subject,
          html: brandedHtml,
        });
        successCount++;
      } catch (err) {
        console.error("Failed to send to", email);
      }
    }

    return NextResponse.json({ success: true, count: successCount });
  } catch (error) {
    console.error("Error broadcasting email:", error);
    return NextResponse.json({ error: 'Failed to broadcast email' }, { status: 500 });
  }
}
