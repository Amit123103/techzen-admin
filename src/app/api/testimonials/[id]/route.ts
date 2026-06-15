import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing testimonial ID' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing testimonial ID' }, { status: 400 });
    }

    const updates = await request.json();

    const { error } = await supabaseAdmin
      .from('testimonials')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
