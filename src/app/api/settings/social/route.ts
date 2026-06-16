import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No row found, return an empty object
        return NextResponse.json({});
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching social settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch social settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const { whatsapp, instagram, linkedin, phone, youtube, facebook, twitter, discord } = body;
    
    const { data, error } = await supabaseAdmin
      .from('settings')
      .upsert({
        id: 1,
        whatsapp,
        instagram,
        linkedin,
        phone,
        youtube,
        facebook,
        twitter,
        discord,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating social settings:", error);
    return NextResponse.json(
      { error: "Failed to update social settings" },
      { status: 500 }
    );
  }
}
